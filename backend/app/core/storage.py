import uuid
from typing import Optional
import boto3
from botocore.config import Config
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings


class S3StorageService:
    """Servicio para subir imágenes a Cloudflare R2 (S3 compatible)."""
    
    def __init__(self):
        self.bucket_name = settings.r2_bucket_name or "iron-gear"
        self.endpoint_url = settings.r2_endpoint or ""
        self.access_key = settings.r2_access_key or ""
        self.secret_key = settings.r2_secret_key or ""
        self.public_url = settings.r2_public_url or ""
        
        if not self.endpoint_url or not self.access_key or not self.secret_key:
            print("⚠️ Advertencia: R2 no configurado. Las cargas de imagen fallarán.")
            self.s3_client = None
            return
        
        # Configurar cliente S3
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version="s3v4"),
            region_name="auto"
        )
    
    async def upload_image(self, file: UploadFile) -> str:
        """
        Sube una imagen a Cloudflare R2 y retorna la URL pública.
        
        Args:
            file: Archivo de imagen tipo UploadFile de FastAPI
            
        Returns:
            URL pública del archivo subido
            
        Raises:
            HTTPException: Si el archivo es inválido o la subida falla
        """
        # Validar tipo de archivo
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo debe ser una imagen"
            )
        
        # Validar tamaño (max 5MB)
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La imagen no puede superar 5MB"
            )
        
        # Generar nombre único
        file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        try:
            if not self.s3_client:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Servicio de almacenamiento no configurado"
                )
            
            # Leer contenido del archivo
            content = await file.read()
            
            # Subir a R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=content,
                ContentType=file.content_type,
                ACL="public-read"
            )
            
            # Construir URL pública
            public_url = f"{self.public_url}/{unique_filename}"
            return public_url
            
        except Exception as e:
            print(f"Error subiendo imagen a R2: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al subir imagen: {str(e)}"
            )
        finally:
            await file.seek(0)
    
    async def delete_image(self, image_url: str) -> bool:
        """
        Elimina una imagen de Cloudflare R2.
        
        Args:
            image_url: URL pública de la imagen
            
        Returns:
            True si se eliminó correctamente
        """
        if not image_url or not self.public_url:
            return False
            
        try:
            # Extraer nombre del archivo de la URL
            filename = image_url.replace(self.public_url + "/", "")
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=filename
            )
            return True
        except Exception as e:
            print(f"Error eliminando imagen de R2: {e}")
            return False


# Instancia global del servicio
storage_service = S3StorageService()