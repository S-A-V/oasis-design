import { withInstallDirective } from '@way-ui/internal-utils';

import copyText from './copyText';
import permission from './permission';
import rolePermission from './rolePermission';

export const VCopyText = withInstallDirective(copyText, 'copyText');
export const VPermission = withInstallDirective(permission, 'permission');
export const VRolePermission = withInstallDirective(rolePermission, 'rolePermission');
