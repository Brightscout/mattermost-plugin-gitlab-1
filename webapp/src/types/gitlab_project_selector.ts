export interface Selection {
    name: string;
    project_id: number | undefined;
}

export interface Project{
    path_with_namespace: string;
    id: number;
}
