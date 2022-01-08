import  {  gql  }  from  "apollo-server-micro"; 

export  const  typeDefs  =  gql`
    type  Officer {
        id: ID!
        name: String!
        acm_email: String
        linkedin: String
        roles: [Role]
        accolades: [Accolade]
    }

    type  Role {
        id: ID
        title: String!
        start: String
        end: String
    }

    type  Accolade {
        id: ID
        text: String
        date: String
        sender_email: String
        sender_name: String
    }

    type  Query {
        getOfficers(query: String): [Officer]
        getOfficer(id: String, name: String): Officer!
    }`