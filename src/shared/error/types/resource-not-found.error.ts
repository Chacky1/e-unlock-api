class ResourceNotFoundError extends Error {
  constructor(resourceName: string, id: string) {
    super(`Resource ${resourceName} with id ${id} not found.`);
  }
}

export { ResourceNotFoundError };
