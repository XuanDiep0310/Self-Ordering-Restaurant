const InputField = ({ label, name, value, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="block font-bold mb-2 w-1/3">{label}:</label>
      <input
        type={name === "password" ? "password" : "text"} // Hiển thị mật khẩu dưới dạng password
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-2/3 border bg-[#ced4d5] text-black rounded p-2"
      />
    </div>
  );
};

export default InputField;