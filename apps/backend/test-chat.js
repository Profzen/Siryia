const { io } = require("socket.io-client");

async function runTest() {
  console.log("1. Création des utilisateurs de test via l'API REST...");

  const user1Data = { email: `test1_${Date.now()}@siryia.com`, password: "password123" };
  const user2Data = { email: `test2_${Date.now()}@siryia.com`, password: "password123" };

  // Fonction utilitaire pour enregistrer un utilisateur et récupérer son Token & ID
  async function registerAndGetAuth(userData) {
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Erreur d'enregistrement pour ${userData.email}:`, errorText);
      process.exit(1);
    }
    
    const data = await res.json();
    
    // Extraire l'ID utilisateur du payload du JWT
    const payloadBase64 = data.access_token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    
    return { access_token: data.access_token, user: { id: payload.sub } };
  }

  const auth1 = await registerAndGetAuth(user1Data);
  const auth2 = await registerAndGetAuth(user2Data);

  console.log(`✅ Utilisateurs créés !`);
  console.log(`- Alice (ID: ${auth1.user.id})`);
  console.log(`- Bob   (ID: ${auth2.user.id})\n`);

  console.log("2. Connexion d'Alice au WebSocket...");
  const socketAlice = io("http://localhost:3001", {
    extraHeaders: { Authorization: `Bearer ${auth1.access_token}` }
  });

  socketAlice.on("connect", () => {
    console.log("✅ Alice connectée au WebSocket ! (ID socket:", socketAlice.id, ")");
    
    const testMessage = {
      receiverId: auth2.user.id,
      content: "Salut Bob ! Mon email est alice.pro@gmail.com et mon numéro est 00228 90 90 90 90.",
      messageType: "TEXT"
    };

    console.log("\n3. Alice envoie un message à Bob avec des coordonnées personnelles...");
    socketAlice.emit("sendMessage", testMessage, (response) => {
      console.log("✅ Accusé de réception (Alice) : Le message a été traité par le serveur.");
    });
  });

  console.log("4. Connexion de Bob au WebSocket pour recevoir le message en temps réel...");
  const socketBob = io("http://localhost:3001", {
    extraHeaders: { Authorization: `Bearer ${auth2.access_token}` }
  });

  socketBob.on("newMessage", (msg) => {
    console.log("\n🔔 Bob a reçu un nouveau message !");
    console.log("Contenu reçu :", msg.content);
    console.log("Filtré par l'anti-contournement ?", msg.isFiltered ? "OUI" : "NON");
    
    console.log("\n🎉 Le test complet est un succès ! Appuyez sur Ctrl+C pour quitter.");
  });

  socketAlice.on("connect_error", (err) => console.log("Erreur de connexion Alice:", err.message));
  socketBob.on("connect_error", (err) => console.log("Erreur de connexion Bob:", err.message));
}

runTest();

