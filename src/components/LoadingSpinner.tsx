import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  overlay?: boolean
}

const LoadingSpinner = ({ size = 'medium', message, overlay = false }: LoadingSpinnerProps) => {
  const Component = overlay ? 'div' : 'span'
  
  return (
    <Component className={`loading-spinner ${overlay ? 'overlay' : ''} ${size}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </Component>
  )
}

export default LoadingSpinner
