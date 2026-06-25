import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(StorageService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Variables SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes.');
      // En développement, on ne crash pas brutalement si on veut juste tester l'API sans uploader, 
      // mais en prod ça jettera une erreur.
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Upload un fichier dans le bucket spécifié.
   * Retourne le chemin complet dans le bucket.
   */
  async uploadFile(bucket: string, path: string, file: Express.Multer.File): Promise<string> {
    if (!this.supabase) throw new Error('Supabase Client non initialisé.');

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Erreur d'upload: ${error.message}`);
      throw new Error(`Erreur lors de l'upload du fichier: ${error.message}`);
    }

    return data.path;
  }

  /**
   * Génère une URL signée éphémère (pour la consultation sécurisée par les admins)
   */
  async createSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    if (!this.supabase) throw new Error('Supabase Client non initialisé.');

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      this.logger.error(`Erreur création URL signée: ${error.message}`);
      throw new Error(`Impossible de générer l'URL signée: ${error.message}`);
    }

    return data.signedUrl;
  }
}
