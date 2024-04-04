import { Inject, Injectable } from '@nestjs/common';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { JobStatus } from '~api/domain/jobs/typing/enums';
import { PROJECTS_REPOSITORY } from '~api/domain/projects/consts';
import { IProjectsRepository } from '~api/domain/projects/interfaces';
import { ProjectStatus } from '~api/domain/projects/typing/enums';
import { IUsersService, USERS_SERVICE, UserRole } from '~api/domain/users/typing';
import { InvalidCredentialsException } from '~api/shared';
import { RemoveUserPayloadDto } from './dto';

@Injectable()
export class AppAccountService {
	@Inject(USERS_SERVICE)
	private readonly usersService: IUsersService;

	@Inject(PROJECTS_REPOSITORY)
	private readonly projectsRepository: IProjectsRepository;

	@Inject(JOB_REPOSITORY)
	private readonly jobRepository: IJobRepository;

	public async getAccount(id: number) {
		const user = await this.usersService.getOneBy({ id });
		return user;
	}

	public async delete(id: number, dto: RemoveUserPayloadDto) {
		const user = await this.usersService.getOneBy({ id });

		const isCorrect = await this.usersService.compareUserPassword(user.id, dto.password);
		if (!isCorrect) throw new InvalidCredentialsException();

		await this.usersService.delete(id);
		if (user.role === UserRole.Employer) await this.onDeleteEmployer(id);
	}

	private async onDeleteEmployer(userId: number) {
		const projects = await this.projectsRepository.findBy({
			creatorId: userId,
			status: ProjectStatus.InProgress,
		});

		for await (const project of projects) {
			await this.projectsRepository.update(project.id, {
				status: ProjectStatus.Closed,
			});
			await this.jobRepository.update(
				{
					projectId: project.id,
				},
				{
					status: JobStatus.Close,
				},
			);
		}
	}
}
