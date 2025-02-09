const AnnotationHistory = (
    { avatarText, name, timeAgo, action, timeSpent, additionalTime }) => {
    return (
      <div className="flex p-2 mt-2 bg-gray-100 rounded-lg">
        {/* Avatar */}
        <div className="mr-1">
          <div className="size-8 text-xs rounded-full bg-white border-2 flex items-center justify-center  font-bold">
            {avatarText}
          </div>
        </div>
        {/* Update info */}
        <div cl>
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-gray-400 text-xs">{timeAgo}</p>
          </div>
          <p className="text-sm text-gray-600 mt-1">{action}</p>
          <p className="text-xs text-gray-500 mt-1">
            Spent {timeSpent}
            {additionalTime && (
              <span className="text-green-600"> (+{additionalTime})</span>
            )}
          </p>
        </div>
      </div>
    );
  };
  
  export default AnnotationHistory;
  