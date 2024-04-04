import { RpcCertificatesModule } from './certificates/certificates.module';
import { RpcRrojectsModule } from './projects/projects.module';

export const getRpcModules = () => [RpcRrojectsModule.forRoot(), RpcCertificatesModule.forRoot()];
