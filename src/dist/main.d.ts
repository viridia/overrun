export declare const argv: {
    [x: string]: unknown;
    f: string | undefined;
    'dry-run': boolean | undefined;
    cwd: string | undefined;
    w: boolean | undefined;
    targets: string | undefined;
    color: boolean | undefined;
    _: (string | number)[];
    $0: string;
};
export declare function build(): Promise<void>;
