import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, Box, Image, Heading, Flex } from "@chakra-ui/react";
import './App.css'

//pegamos a api de pokemon no link:
//  https://dev.to/kristinadev/building-a-pokemon-card-collection-with-react-and-chakra-ui-1odc 
//Para fazer o layout parecido com o de pokemon

/*Coisa que faltam alterar:
*mudar imagem de cards
*colocar caracteristicas dos personagens nas cartas (força, vida, velocidade...)
*/


type PokemonResult = {
  name: string;
  url: string;
};

type PokemonCard = {
  id: string;
  name: string;
  image: string;
};

function App() {
  const [data, setData] = useState<PokemonCard[]>([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((res) => res.json())
      .then((data: { results: PokemonResult[] }) =>
        setData(
          data.results.map((result) => {
            const match = result.url.match(/\/([0-9]*)\/$/);
            if (!match) throw new Error(`URL inválida: ${result.url}`);
            const id = match[1];
            return {
              id,
              name: result.name, 
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` //será que conseguimos trocar a imagens dos pokemons por zombies e plantas?
            };
          })
        )
      );
  }, []);

  // Função para alternar visibilidade
  const handleButtonClick = () => setShowData(!showData);

  return (
    <Box p="6" backgroundColor="#03001C">
      <Heading mb="6" textAlign="center" color="white">
        Minha coleção de cards
      </Heading>
      <Flex justifyContent="center">
        <Button background={'green'} colorScheme="teal" onClick={handleButtonClick}>
          {showData ? "Esconder cards" : "Mostrar cards"}
        </Button>
      </Flex>
      <Flex mt="6" flexWrap="wrap" justifyContent="center">
        {showData &&
          data.map((result) => (
            <Box
              key={result.id}
              boxShadow="0 0 10px 3px rgba(0, 128, 128, 0.5)"
              rounded="md"
              overflow="hidden"
              mx="4"
              my="2"
              _hover={{ boxShadow: "lg" }}
              transition="box-shadow 0.2s"
            >
              <Image src={result.image} alt={result.name} />
              <Box p="4">
                <Heading
                  as="h3"
                  size="md"
                  textAlign="center"
                  color="whiteAlpha.800"
                >
                  {result.name}
                </Heading>
              </Box>
            </Box>
          ))}
      </Flex>
    </Box>
  );
}

export default App;