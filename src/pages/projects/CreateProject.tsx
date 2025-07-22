import type { projectSchema } from "../../types/projectAllTypes/projectSchema";
import CreateProjectForm from "./CreatedAndEditProjectForm";
import type { z } from 'zod';
type ProjectForm = z.infer<typeof projectSchema>;
 const CreateProjectPage = () => {
  const handleCreate = (data: ProjectForm) => {
   
    console.log("Create:", data);
  };

  return <CreateProjectForm onSubmit={handleCreate} submitText="Create Project" />;
};
export default CreateProjectPage;