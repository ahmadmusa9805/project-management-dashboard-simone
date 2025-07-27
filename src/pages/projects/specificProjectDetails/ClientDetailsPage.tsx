


import { Camera } from "lucide-react";
import { useState } from "react";



const ClientDetailsPage = () => {
  const [isEditing, ] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://placehold.co/80x80"
  );
 

  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Khan",
    phone: "+123 45875 97 5678",
    email: "mariapicio@gmail.com",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const renderInput = (
    label: string,
    name: keyof typeof formData,
    defaultValue: string
  ) => (
    <div className="w-[364px] flex flex-col justify-start items-start gap-4">
      <label className="text-[#2B3738] text-sm font-normal">{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name] ?? ""}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder={formData[name] || defaultValue}
        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none"
      />
    </div>
  );

  return (
    <div className="w-full h-full px-8 py-6 bg-white flex flex-col justify-start items-end gap-8">
      {/* Header */}
      <div className="w-full flex justify-start items-end gap-8">
        <div className="flex justify-start items-center gap-1">
          <div className="flex justify-center items-center gap-2.5">
            <div className="text-black text-2xl font-medium leading-8 tracking-wide font-ibm">
              Clients Details
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="w-full p-6 bg-[#F7F7F7] rounded border-2 border-[#E6E7E7] flex flex-col justify-start items-start gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-12">
          <div className="w-full flex flex-col justify-start items-start gap-12">
            <div className="w-full flex flex-col justify-start items-start gap-6">
              <div className="h-4" />
              <div className="w-full relative rounded-2xl flex flex-col justify-center items-center gap-3">
                <div className="w-20 h-20 relative rounded-2xl">
                  <div className="w-20 h-20 relative rounded-2xl">
                    <img
                      src={profileImage}
                      alt="profile"
                      className="w-20 h-20 rounded"
                    />
                    <label className="p-1 rounded cursor-pointer flex items-center justify-center absolute bottom-0 right-0 bg-[#F7F7F7]">
                      <Camera size={20} color="#83ac72" strokeWidth={2.5} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-center gap-2">
            <h2 className="text-center font-bold ">
              {formData.firstName + " " + formData.lastName}
            </h2>
            <h2 className="text-center font-bold ">{formData.email}</h2>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="w-full flex flex-col justify-start items-start gap-12">
        <div className="w-full flex flex-col justify-start items-start gap-6">
          <div className="w-full flex justify-start items-center gap-4">
            <div className="flex-1 flex flex-col justify-center text-black text-lg font-medium leading-[24.3px] tracking-tight font-ibm">
              Personal Information
            </div>
            
      
          </div>

          {/* Fields */}
          <div className="w-full flex justify-start items-center gap-[51px]">
            <div className="w-[364px] flex flex-col justify-start items-start gap-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-center flex-col text-sm font-medium leading-[16.24px] font-ibm">
                  {" "}
                  {renderInput("First Name", "firstName", "John")}
                </div>
              </div>
            </div>
            <div className="w-[364px] flex flex-col justify-start items-start gap-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-center flex-col text-black text-sm font-medium leading-[16.24px] font-ibm">
                  {" "}
                  {renderInput("Last Name", "lastName", "Doe")}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-start items-center gap-[51px]">
            <div className="w-[364px] flex flex-col justify-start items-start gap-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-center flex-col text-black text-sm font-medium leading-[16.24px] font-ibm">
                  {renderInput("Phone Number", "phone", "+8801XXXXXXXXX")}
                </div>
              </div>
            </div>
            <div className="w-[364px] flex flex-col justify-start items-start gap-4">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-center flex-col text-black text-sm font-medium leading-[16.24px] font-ibm">
                  {" "}
                  {renderInput("E-mail", "email", "example@example.com")}
                </div>
              </div>
            </div>
          </div>
        </div>

       



      
</div>
    </div>
  );
};

export default ClientDetailsPage ;
