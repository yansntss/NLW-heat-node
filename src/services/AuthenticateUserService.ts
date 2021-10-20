import axios from "axios";


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
    id: string
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


        //toda info q eh retornada é atribuida ao data
        return response.data;
    }
}

export { AuthenticateUserService }