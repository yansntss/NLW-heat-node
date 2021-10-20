
import prismaClient from "../prisma"



class GetLast3MessagesService {
   async execute(){
    //as 3 ultimas da mais nova para a mais velha 
     const messages = await prismaClient.message.findMany({
       take:3,
       orderBy: {
         created_at: "desc"
       },
       include: {
         user:true,
       },
     });

     //  EM SQL -> SELECT * FROM MESSAGES LIMIT 3 ORDER BY CREATED_AT DESC

     return messages;
   }
}

export { GetLast3MessagesService }