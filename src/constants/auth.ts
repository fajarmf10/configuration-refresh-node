export const clientSecrets: { [bankCode: string]: string } = {
    ['BCA']: process.env.BCA_SNAP_CLIENT_SECRET || 'test',
    ['BNI']: process.env.BNI_SNAP_CLIENT_SECRET || 'test',
    ['BRI']: process.env.BRI_SNAP_CLIENT_SECRET || 'test',
    ['CIMB']: process.env.CIMB_SNAP_CLIENT_SECRET || 'test',
    ['MANDIRI']: process.env.MANDIRI_SNAP_CLIENT_SECRET || 'test',
    ['PERMATA']: process.env.PERMATA_SNAP_CLIENT_SECRET || 'test',
    BSS: process.env.BSS_SNAP_CLIENT_SECRET || 'test',
};
