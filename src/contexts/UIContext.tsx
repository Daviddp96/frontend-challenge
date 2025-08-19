import React, { createContext, useContext, useState } from 'react'

interface UIState {
  isLoading: boolean
  loadingMessage: string
  notifications: Notification[]
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

interface UIContextType {
  state: UIState
  setLoading: (loading: boolean, message?: string) => void
  showNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UIState>({
    isLoading: false,
    loadingMessage: '',
    notifications: []
  })

  const setLoading = (loading: boolean, message: string = '') => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      loadingMessage: message
    }))
  }

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 4000
    }

    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }))

    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }))
  }

  const value: UIContextType = {
    state,
    setLoading,
    showNotification,
    removeNotification
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
