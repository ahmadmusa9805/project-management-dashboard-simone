import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { projectSchema } from "../../types/projectAllTypes/projectSchema";
import CreateProjectForm from "./CreatedAndEditProjectForm";
import type { z } from 'zod';
type ProjectForm = z.infer<typeof projectSchema>;

const EditProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectForm | null>(null);

  useEffect(() => {
    // Replace with real API call
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data));
  }, [id]);

  const handleUpdate = (updated: ProjectForm) => {
    console.log("Update:", updated);
    // Call your update API here
  };

  if (!project) return <div>Loading...</div>;

  return (
    <CreateProjectForm
      onSubmit={handleUpdate}
      defaultValues={project}
      submitText="Update Project"
    />
  );
};
export default EditProjectPage;