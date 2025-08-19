import { useUI } from '../contexts/UIContext'
import './NotificationCenter.css'

const NotificationCenter = () => {
  const { state, removeNotification } = useUI()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check_circle'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
      default:
        return 'info'
    }
  }

  if (state.notifications.length === 0) {
    return null
  }

  return (
    <div className="notification-center">
      {state.notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            <span className="material-icons">{getIcon(notification.type)}</span>
          </div>
          
          <div className="notification-content">
            <h4 className="notification-title">{notification.title}</h4>
            <p className="notification-message">{notification.message}</p>
          </div>
          
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationCenter
