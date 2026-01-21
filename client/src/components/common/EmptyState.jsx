const EmptyState = ({ icon: Icon, title, description, action, actionText }) => {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-blue-400" />
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      
      {description && (
        <p className="text-gray-400 mb-8 max-w-md mx-auto">{description}</p>
      )}
      
      {action && actionText && (
        <button onClick={action} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;