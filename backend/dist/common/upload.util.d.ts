type UploadedFile = {
    mimetype: string;
    originalname: string;
    filename: string;
};
export declare const imageUploadOptions: {
    storage: any;
    limits: {
        fileSize: number;
    };
    fileFilter: (_req: any, file: UploadedFile, cb: any) => any;
};
export declare const toPublicUploadPath: (file?: UploadedFile) => string | undefined;
export {};
