import axios from "axios";
import prismaClient from "../prisma"
import { sign } from "jsonwebtoken"
/**
 * Receber code(String)
 * Recupar o access_token no github
 * recuperar info dos user no github
 *
 * verificar se o usuario existe no DB
 * -----------Sim = gerar um token
 * -----------nao = cria no DB, gera um token
 * retornar o token com as infos do user logado
 */

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    name: string,
    id: number,

}

class AuthenticateUserService {
    async execute(code: String) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }

        })

        const response = await axios.get<IUserResponse>("htpps://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token} `,
            },
        });

        const { avatar_url,
            login,
            name,
            id } = response.data;


        //verificando se existe um usuario fazendo um select onde o github_id(db) tem que ser igual ao  id(passado pelo github)
        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id,
            }
        })
        //se nao tiver usuario com o msm id, entao crio um
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    avatar_url,
                    github_id: id,
                    login,
                    name,
                }
            })
        }

        //gerando token
        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );
        return {token, user}


        //toda info q eh retornada é atribuida ao data
        return response.data;
    }
}

export { AuthenticateUserService }