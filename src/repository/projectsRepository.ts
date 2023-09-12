import { knex, Knex } from 'knex'
import { v4 as uuidv4 } from 'uuid'


class ProjectsRepository {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db
    }

    async getAllProjects(sub: string) {
        return this.db('projects')
            .where('user_id', sub)
            .select()
    }

    async getProjectsByDate(sub: string, startDate: string, endDate: string) {
        return this.db('projects')
            .where('user_id', sub)
            .whereBetween('created_at', [startDate, endDate])
            .select();
    }

    async getProjectsById(sub: string, id: string) {
        return this.db('projects')
            .where('user_id', sub)
            .where('id', id)
            .first()
    }

    async getSummaryOfProjects(sub: string) {
        return this.db('projects')
            .where('user_id', sub)
            .sum('value', { as: 'summary of values' })
            .first()
    }

    async postCreateProject(projectsData: {
        project_name: string,
        client_name: string,
        value: number,
        session_id: string,
        its_paid: string,
        user_id: string
        person: string
    }) {
        const id = uuidv4();
        await this.db('projects').insert({
            id, ...projectsData
        });

        const user = await this.db('users').where({ id: projectsData.user_id })
            .first()

        console.log(user)

        if (user) {
            await this.db('users')
                .where({ id: user.id })
                .update({ balance: user.balance + projectsData.value })

            console.log('Saldo após a atualização:', user.balance);

        }
    }

    async deleteProjectById(sub: string, id: string) {
        return this.db('projects')
            .delete()
            .where({
                user_id: sub,
                id: id,
            })
    }
}

export default ProjectsRepository;