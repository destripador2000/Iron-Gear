from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.md_Distributor import Distributor as tbl_Distributor
from app.models.md_User import User
from app.schemas.distributor_schema import (
    DistributorCreate,
    DistributorRead,
    DistributorUpdate,
)
from app.api.deps import get_current_seller

router = APIRouter()


@router.get("/", response_model=list[DistributorRead])
async def get_distributors(conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Distributor)
        result = await conex.execute(stmt)
        distributors = result.scalars().all()
        return distributors
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener distribuidores: {str(e)}"
        )


@router.get("/{distributor_id}", response_model=DistributorRead)
async def get_distributor(distributor_id: int, conex: AsyncSession = Depends(get_db)):
    try:
        stmt = select(tbl_Distributor).where(tbl_Distributor.id == distributor_id)
        result = await conex.execute(stmt)
        distributor = result.scalar_one_or_none()
        if not distributor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Distribuidor no encontrado"
            )
        return distributor
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener distribuidor: {str(e)}"
        )


@router.post("/", response_model=DistributorRead, status_code=status.HTTP_201_CREATED)
async def create_distributor(
    distributor_data: DistributorCreate,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        nuevo = tbl_Distributor(**distributor_data.model_dump(exclude_unset=True))
        conex.add(nuevo)
        await conex.commit()
        await conex.refresh(nuevo)
        return nuevo
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear distribuidor: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al crear distribuidor: {str(e)}"
        )


@router.patch("/{distributor_id}", response_model=DistributorRead)
async def update_distributor(
    distributor_id: int,
    distributor_data: DistributorUpdate,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        stmt = select(tbl_Distributor).where(tbl_Distributor.id == distributor_id)
        result = await conex.execute(stmt)
        distributor = result.scalar_one_or_none()
        if not distributor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Distribuidor no encontrado"
            )
        
        update_data = distributor_data.model_dump(exclude_unset=True, exclude_none=True)
        if not update_data:
            return distributor
        
        for field, value in update_data.items():
            setattr(distributor, field, value)
        
        await conex.commit()
        await conex.refresh(distributor)
        return distributor
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar distribuidor: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al actualizar distribuidor: {str(e)}"
        )


@router.delete("/{distributor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_distributor(
    distributor_id: int,
    conex: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_seller)
):
    try:
        stmt = select(tbl_Distributor).where(tbl_Distributor.id == distributor_id)
        result = await conex.execute(stmt)
        distributor = result.scalar_one_or_none()
        if not distributor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Distribuidor no encontrado"
            )
        
        await conex.delete(distributor)
        await conex.commit()
        return None
    except HTTPException:
        raise
    except IntegrityError as e:
        print(f"Error de request: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al eliminar distribuidor: {str(e)}"
        )
    except Exception as e:
        print(f"Error con el server: {e}")
        await conex.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado al eliminar distribuidor: {str(e)}"
        )