const InfoItem = ({ label, value }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-base font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
  
  
  export default InfoItem;