import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../app/lib/store'
import { fetchCharters, createCharter, updateCharter, deleteCharter } from '../app/lib/features/charters/chartersSlice'
import CharterFilters, { CharterFilters as CharterFiltersType } from './filters/CharterFilters'
import CharterFormModal, { CharterFormData } from './CharterFormModal'

interface ChartersListProps {
  cruiseId: number
  itineraryId: number
}

export default function ChartersList({ cruiseId, itineraryId }: ChartersListProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { items: charters, status, error } = useSelector((state: RootState) => state.charters)

  React.useEffect(() => {
    dispatch(fetchCharters({ cruiseId, itineraryId }))
  }, [dispatch, cruiseId, itineraryId])

  const [filters, setFilters] = React.useState<CharterFiltersType>({
    minPrice: null,
    maxPrice: null,
    minPersons: null,
    maxPersons: null,
    searchTerm: ''
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedCharter, setSelectedCharter] = React.useState<typeof charters[0] | null>(null)

  const filteredCharters = React.useMemo(() => {
    if (!Array.isArray(charters)) return []
    
    return charters.filter(charter => {
      if (!charter) return false
      
      if (filters.searchTerm && !charter.name?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }
      if (filters.minPrice && (typeof charter.price !== 'number' || charter.price < filters.minPrice)) {
        return false
      }
      if (filters.maxPrice && (typeof charter.price !== 'number' || charter.price > filters.maxPrice)) {
        return false
      }
      if (filters.minPersons && (typeof charter.persons !== 'number' || charter.persons < filters.minPersons)) {
        return false
      }
      if (filters.maxPersons && (typeof charter.persons !== 'number' || charter.persons > filters.maxPersons)) {
        return false
      }
      return true
    })
  }, [charters, filters])

  const handleCreateCharter = async (charterData: CharterFormData) => {
    try {
      await dispatch(createCharter({ cruiseId, itineraryId, charterData })).unwrap()
    } catch (error) {
      console.error('Error creating charter:', error)
    }
  }

  const handleUpdateCharter = async (charterId: number, charterData: CharterFormData) => {
    try {
      await dispatch(updateCharter({ cruiseId, itineraryId, charterId, charterData })).unwrap()
    } catch (error) {
      console.error('Error updating charter:', error)
    }
  }

  const handleDeleteCharter = async (charterId: number) => {
    if (window.confirm('Are you sure you want to delete this charter?')) {
      try {
        await dispatch(deleteCharter({ cruiseId, itineraryId, charterId })).unwrap()
      } catch (error) {
        console.error('Error deleting charter:', error)
      }
    }
  }

  const handleEditClick = (charter: typeof charters[0]) => {
    if (!charter) return
    setSelectedCharter(charter)
    setIsEditModalOpen(true)
  }

  if (status === 'loading') {
    return <div>Loading charters...</div>
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex gap-6">
      <div className="w-64">
        <CharterFilters onFilterChange={setFilters} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Charters</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
          >
            New Charter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(filteredCharters) && filteredCharters.length > 0 ? (
            filteredCharters.map(charter => {
              if (!charter) return null
              
              return (
                <div key={charter.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">{charter.name || 'Sin nombre'}</h3>
                  <p className="text-gray-600 mb-2">{charter.description || 'Sin descripción'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-semibold">
                      ${charter && typeof charter.price === 'number' ? charter.price.toLocaleString() : '0'}
                    </span>
                    <span className="text-gray-600">
                      {charter && typeof charter.persons === 'number' ? `${charter.persons} persons` : '0 persons'}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEditClick(charter)}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCharter(charter.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No hay charters disponibles
            </div>
          )}
        </div>
      </div>

      <CharterFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCharter}
        title="New Charter"
      />

      <CharterFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCharter(null)
        }}
        onSubmit={(data) => selectedCharter && handleUpdateCharter(selectedCharter.id, data)}
        initialData={selectedCharter || undefined}
        title="Edit Charter"
      />
    </div>
  )
} 