const InputField = ({ label, name, value, onChange, disabled, type = "text", placeholder = "" }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`border rounded px-3 py-2 ${
          disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
        }`}
      />
    </div>
  );
};

export default InputField;