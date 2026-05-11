import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../../infrastructure/api/adminService';
import type { User, UserCreate, Distributor, DistributorCreate, UserRole } from '../../../../domain/administration/types';
import { USER_ROLES } from '../../../../domain/administration/types';
import styles from './AdministrationView.module.css';

type TabType = 'users' | 'distributors';

interface ModalState {
  isOpen: boolean;
  type: 'createUser' | 'createDistributor' | null;
}

const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'administrador': return styles.roleAdmin;
    case 'vendedor': return styles.roleSeller;
    default: return styles.roleClient;
  }
};

export const AdministrationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await adminService.getUsers();
    if (res.data) setUsers(res.data);
    else setError(res.error);
    setLoading(false);
  }, []);

  const fetchDistributors = useCallback(async () => {
    setLoading(true);
    const res = await adminService.getDistributors();
    if (res.data) setDistributors(res.data);
    else setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else fetchDistributors();
  }, [activeTab, fetchUsers, fetchDistributors]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await adminService.deleteUser(id);
    fetchUsers();
  };

  const handleDeleteDistributor = async (id: number) => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    await adminService.deleteDistributor(id);
    fetchDistributors();
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData: UserCreate = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as UserRole,
    };
    const res = await adminService.createUser(userData);
    if (!res.error) {
      setModal({ isOpen: false, type: null });
      fetchUsers();
    } else {
      setError(res.error);
    }
  };

  const handleCreateDistributor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const distributorData: DistributorCreate = {
      name: formData.get('name') as string,
      contact_email: formData.get('contact_email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || undefined,
    };
    const res = await adminService.createDistributor(distributorData);
    if (!res.error) {
      setModal({ isOpen: false, type: null });
      fetchDistributors();
    } else {
      setError(res.error);
    }
  };

  const renderRoleBadge = (role: string) => (
    <span className={`${styles.roleBadge} ${getRoleBadgeClass(role)}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Administración</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'distributors' ? styles.active : ''}`}
          onClick={() => setActiveTab('distributors')}
        >
          Proveedores
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {activeTab === 'users' && (
        <>
          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal({ isOpen: true, type: 'createUser' })}>
              + Crear Usuario
            </button>
          </div>
          {loading ? (
            <div className={styles.loading}>Cargando...</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{renderRoleBadge(user.role)}</td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDeleteUser(user.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className={styles.emptyState}>No hay usuarios</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'distributors' && (
        <>
          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal({ isOpen: true, type: 'createDistributor' })}>
              + Crear Proveedor
            </button>
          </div>
          {loading ? (
            <div className={styles.loading}>Cargando...</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {distributors.length > 0 ? distributors.map(dist => (
                    <tr key={dist.id}>
                      <td>{dist.name}</td>
                      <td>{dist.contact_email || '-'}</td>
                      <td>{dist.phone || '-'}</td>
                      <td className={dist.is_active ? styles.statusActive : styles.statusInactive}>
                        {dist.is_active ? 'Activo' : 'Inactivo'}
                      </td>
                      <td>
                        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDeleteDistributor(dist.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className={styles.emptyState}>No hay proveedores</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modal.isOpen && modal.type === 'createUser' && (
        <div className={styles.modalOverlay} onClick={() => setModal({ isOpen: false, type: null })}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Crear Usuario</h2>
            <form onSubmit={handleCreateUser}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre</label>
                <input name="name" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Correo</label>
                <input name="email" type="email" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contraseña</label>
                <input name="password" type="password" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rol</label>
                <select name="role" className={styles.formSelect} defaultValue="cliente">
                  {USER_ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setModal({ isOpen: false, type: null })}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal.isOpen && modal.type === 'createDistributor' && (
        <div className={styles.modalOverlay} onClick={() => setModal({ isOpen: false, type: null })}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Crear Proveedor</h2>
            <form onSubmit={handleCreateDistributor}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre</label>
                <input name="name" className={styles.formInput} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Correo de contacto</label>
                <input name="contact_email" type="email" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Teléfono</label>
                <input name="phone" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Dirección</label>
                <input name="address" className={styles.formInput} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setModal({ isOpen: false, type: null })}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};