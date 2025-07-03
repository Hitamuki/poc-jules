// Export common schemas directly if they are widely used
export * from "./common";

// It's often better to import specific schemas via their subpath
// for clarity, e.g.:
// import { LoginSchema } from '@bookmark-todo-app/zod-schemas/auth';
// import { UserProfileSchema } from '@bookmark-todo-app/zod-schemas/user';

// This index.ts can also be used to group and re-export schemas if a flat import
// structure is preferred for some schemas, but subpath imports are generally good for organization.

// Example: If you absolutely want to enable `import { LoginSchema } from '@bookmark-todo-app/zod-schemas';`
// then you would do:
// export * from "./auth";
// export * from "./user";
// export * from "./bookmark";
// etc.
// However, this can lead to a very large index file and potential naming conflicts.

// For now, only common schemas are exported from the root.
// Other schemas should be accessed via their specific file paths like:
// import { SpecificSchema } from "@bookmark-todo-app/zod-schemas/specificModule";
