const fetchGraphql = async (query) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(query),
    };
    try {
        console.log("options", options)
        const response = await fetch('http://localhost:3000/graphql', options);
        const json = await response.json();
        return json.data;
    } catch (e) {
        console.error(e);
        return false;
    }
};

const addAnimal = async (message) => {
    console.log("ADD aniaml")
    const ADD_ANIMAL_MUTATION = {
        query: `
            mutation VariableTest($animalName: String!) {
                addAnimal(animalName: $animalName, species: "6061a06623903420e0e53ed1") {
                    animalName  
                }
            }`
        ,
        variables: message,
    };
    const data = await fetchGraphql(ADD_ANIMAL_MUTATION);
    return data.addAnimal;
};

const getAnimals = async () => {
    const query = {
        query: `
            {
                animals{
                    animalName
                }
            }`
    };
    const data = await fetchGraphql(query);
    return data.animals;
};
