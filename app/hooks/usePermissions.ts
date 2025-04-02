import { useAppSelector } from '@/app/hooks'
import { RootState } from '@/app/lib/store'

export const usePermissions = () => {
  const user = useAppSelector((state: RootState) => state.auth.user)
  
  const isSales = Array.isArray(user?.roles) && user.roles.includes('sales')
  const isSuperAdmin = Array.isArray(user?.roles) && user.roles.includes('super-admin')
  const canEdit = !isSales

  return {
    isSales,
    isSuperAdmin,
    canEdit
  }
} 