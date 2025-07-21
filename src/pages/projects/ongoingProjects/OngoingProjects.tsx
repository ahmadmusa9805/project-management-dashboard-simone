import { useNavigate } from "react-router-dom";

const OngoingProjects = () => {
const navigate = useNavigate();
const projects = [
{ id: 1, title: "Green Villa Renovation", status: "Ongoing" },
{ id: 2, title: "TechHub Extension", status: "Ongoing" },
{ id: 3, title: "Skyline Apartment", status: "Ongoing" },
];

return (

<>
  <div className="min-h-[32px] px-6 bg-[#001D01] rounded flex justify-center items-center gap-1 cursor-pointer">
    <div className="w-4 h-4 relative overflow-hidden">
      <div className="w-[1.33px] h-[10.67px] absolute left-[7.33px] top-[2.67px] bg-white" />
      <div className="w-[10.67px] h-[1.33px] absolute left-[2.67px] top-[7.33px] bg-white" />
    </div>
    <div className="text-white text-sm font-ibm font-medium leading-[15.68px] tracking-[0.28px]">
      New Project
    </div>
  </div>

  <div className="w-full px-4 flex flex-col items-start gap-2">
    {projects.map((project) => (
      <div
        key={project.id}
        className="w-full px-4 py-2.5 bg-[#F1F1F1] flex items-center gap-2.5"
      >
        <div className="w-6 h-6 relative overflow-hidden">
          <div className="w-[22px] h-[20px] absolute left-[1px] top-[2px] bg-[#6B7374]" />
        </div>
        <div className="flex-1 flex items-center gap-2.5">
          <div className="text-[#2B3738] text-base font-ibm font-medium leading-[23.52px]">
            {project.title}
          </div>
        </div>
        <div className="px-1 py-0.5 bg-[#ECF1E6] rounded-full flex items-center gap-2.5">
          <div className="text-[#457205] text-xs font-ibm font-medium leading-[15.6px] tracking-[0.36px]">
            {project.status}
          </div>
        </div>
        <div
          className="w-[158px] h-full p-2 flex items-center gap-1 cursor-pointer"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <div className="w-[14px] h-[14px] relative overflow-hidden">
            <div className="w-[14px] h-[10.5px] absolute left-0 top-[1.75px] bg-[#2B3738]" />
            <div className="w-[4.67px] h-[4.67px] absolute left-[4.67px] top-[4.67px] bg-[#2B3738]" />
          </div>
          <div className="text-black text-xs font-ibm font-medium leading-[15.6px] tracking-[0.36px]">
            View details
          </div>
        </div>
      </div>
    ))}
  </div>


</>
);
};

export default OngoingProjects;