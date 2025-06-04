# Introdução

Informações básicas do projeto.

* **Projeto:** Adote.ME
* **Repositório GitHub:** https://github.com/ICEI-PUC-Minas-CC-TI/ti1-2025-1-t2-manha-adoteme
* **Membros da equipe:**
  * [Gabriel Mendonça Almeida Magalhães](https://github.com/)
  * [Gisele Câmara Xavier](https://github.com/giselecx) 
  * [Matheus Gouvêa Ramalho](https://github.com/matheussgr) 
  * [Pedro Augusto Gomes de Araújo](https://github.com/PedroAugustoPucMG) 
  * [Phillipe Wallace Rodrigues Sodré](https://github.com/)
  * [Thalita Ágata Domingos](https://github.com/)

A documentação do projeto é estruturada da seguinte forma:

1. Introdução
2. Contexto
3. Product Discovery
4. Product Design
5. Metodologia
6. Solução
7. Referências Bibliográficas



# Contexto

Detalhes sobre o espaço de problema, os objetivos do projeto, sua justificativa e público-alvo.

## Problema


A adoção de animais no Brasil enfrenta diversos obstáculos que dificultam o processo tanto para os adotantes quanto para as instituições envolvidas. Atualmente, não existe uma plataforma centralizada e confiável que reúna informações atualizadas sobre pets disponíveis para adoção, abrigos, ONGs e protetores independentes.

Essa fragmentação de informações dificulta o acesso dos interessados, que muitas vezes desistem da adoção por não saberem por onde começar ou por se depararem com processos burocráticos, pouco intuitivos e, em alguns casos, excludentes.

Além disso, muitos adotantes não têm clareza sobre os custos e responsabilidades envolvidos no cuidado com um animal, o que pode gerar abandonos futuros. 

Nesse cenário, surge a necessidade de uma solução digital que promova a aproximação entre adotantes e instituições, desburocratize o processo e forneça informações relevantes e educativas sobre adoção responsável.

## Objetivos



* Objetivo Geral:
Desenvolver uma plataforma digital que facilite e incentive a adoção responsável de pets, conectando adotantes a abrigos, ONGs e protetores independentes, de forma acessível, segura e intuitiva.

* Objetivos Específicos:

Centralizar informações de animais disponíveis para adoção e instituições parceiras.

Reduzir a burocracia e simplificar o processo de adoção.

Fornecer orientações educativas sobre cuidados com os pets e responsabilidades do adotante.

Oferecer suporte informativo sobre os custos iniciais da adoção.

## Justificativa


A escolha por desenvolver esta solução surgiu a partir da identificação de um problema social cada vez mais evidente. No Brasil, o processo de adoção de animais ainda enfrenta muitas barreiras, como a falta de acesso à informação e a burocracia envolvida. Enquanto isso, milhares de animais permanecem em abrigos ou nas ruas, muitas vezes sem visibilidade e com poucas chances de encontrar um lar.

Apesar da existência de ONGs e iniciativas individuais que lutam pela causa animal, ainda falta uma ferramenta eficiente que conecte essas iniciativas à população interessada em adotar. Ao unir tecnologia com responsabilidade social, a plataforma visa preencher essa lacuna, ampliando as possibilidades de adoção e garantindo mais bem-estar aos animais.

A solução proposta tem impacto direto não apenas no bem-estar dos pets, mas também na vida das pessoas, ao proporcionar uma experiência de adoção mais humana, informada e segura.

## Público-Alvo



O público-alvo da plataforma é composto por diferentes perfis:

Pessoas interessadas em adotar: Buscam um meio confiável, prático e seguro para encontrar um novo companheiro..

Veterinários e clínicas parceiras: Podem oferecer cuidados básicos aos animais adotados e suporte técnico aos adotantes.

Voluntários e protetores independentes: Atuam no resgate e cuidado inicial dos animais e precisam de apoio para promover as adoções.

Educadores e agentes de conscientização: Trabalham com a divulgação de informações sobre adoção consciente e cuidados com os pets.

Adotantes já experientes: Que podem compartilhar feedback, ajudar na orientação de novos adotantes e continuar conectados à rede de apoio pós-adoção.

Esses diferentes perfis demonstram a necessidade de uma solução abrangente, inclusiva e colaborativa, capaz de atender a múltiplas demandas dentro de um único ecossistema digital.

# Product Discovery

## Etapa de Entendimento


![alt text](<images/Matriz CSD e Mapa de Stakeholders.png>)
![alt text](<images/Entrevistas 1.png>)
![alt text](<images/Entrevistas 2.png>)
![alt text](images/Highlights.png)

## Etapa de Definição

### Personas


![alt text](<images/Persona 1.png>)
![alt text](<images/Persona 2.png>)
![alt text](<images/Persona 3.png>)
![alt text](<images/Persona 4.png>)


# Product Design

Nesse momento, vamos transformar os insights e validações obtidos em soluções tangíveis e utilizáveis. Essa fase envolve a definição de uma proposta de valor, detalhando a prioridade de cada ideia e a consequente criação de wireframes, mockups e protótipos de alta fidelidade, que detalham a interface e a experiência do usuário.

## Histórias de Usuários

![alt text](<images/Histórias Usuários 1.png>)
![alt text](<images/Histórias Usuários 1.png>)


## Proposta de Valor

![alt text](<images/Mapa de Valor 1.png>)
![alt text](<images/Mapa de Valor 2.png>)
![alt text](<images/Mapa de Valor 3.png>)
![alt text](<images/Mapa de Valor 4.png>)



## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
| --- | --- | --- |
| RF-001 | Permitir o cadastro de usuários (adotantes, protetores e ONGs) | ALTA |
| RF-002 | Permitir o cadastro de pets com informações detalhadas (nome, idade, raça, histórico, fotos) | ALTA |
| RF-003 | Permitir busca de pets | ALTA |
| RF-004 | Permitir moderação de usuários e postagens para garantir a segurança | ALTA |


### Requisitos não Funcionais


| ID | Descrição do Requisito | Prioridade |
| --- | --- | --- |
| RNF-001 | O sistema deve ser responsivo e acessível em dispositivos móveis e desktops | ALTA |
| RNF-002 | O sistema deve garantir alta disponibilidade e segurança dos dados | ALTA |
| RNF-003 | O sistema deve ser intuitivo e de fácil usabilidade | ALTA |
| RNF-004 | O sistema deve garantir a proteção dos dados pessoais dos usuários | MÉDIA |
| RNF-005 | O sistema deve ter tempos de resposta rápidos para todas as funcionalidades principais | MÉDIA |
| RNF-006 | O sistema deve ser escalável para futuras atualizações e melhorias | MÉDIA |
| RNF-007 | O sistema deve utilizar tecnologias modernas para backend e frontend | MÉDIA |


## Projeto de Interface

Artefatos relacionados com a interface e a interacão do usuário na proposta de solução.

### Wireframes

Estes são os protótipos de telas do sistema.

![alt text](<images/Wireframes 1.png>)
![alt text](<images/Wireframes 2.png>)
![alt text](<images/Wireframes 3.png>)


### User Flow

![alt text](<images/Fluxo de Usuários.png>)

### Protótipo Interativo

https://www.figma.com/proto/9nqgkjLYdcLDgqU3qD0Ys5/TI-1--?node-id=1-1130&p=f&t=zol3TUu77AKOu688-1&scaling=contain&content-scaling=fixed&page-id=0%3A1

# Metodologia

Detalhes sobre a organização do grupo e o ferramental empregado.

## Ferramentas

Relação de ferramentas empregadas pelo grupo durante o projeto.

| Ambiente                    | Plataforma | Link de acesso                                     |
| --------------------------- | ---------- | -------------------------------------------------- |
| Processo de Design Thinking | Miro       | https://www.canva.com/design/DAGjiSz5Dq0/Vdoa-w5IkelpkL5FbgK9zQ/edit?utm_content=DAGjiSz5Dq0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton        |
| Repositório de código     | GitHub     | https://github.com/ICEI-PUC-Minas-CC-TI/ti1-2025-1-t2-manha-adoteme.git      |
| Protótipo Interativo       | MarvelApp  | https://www.figma.com/proto/9nqgkjLYdcLDgqU3qD0Ys5/TI-1--?node-id=1-1130&p=f&t=zol3TUu77AKOu688-1&scaling=contain&content-scaling=fixed&page-id=0%3A1   |
|                             |            |                                                    |


## Gerenciamento do Projeto

![alt text](images/Kanban.AdoteMe.png)

# Solução Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto

O vídeo a seguir traz uma apresentação do problema que a equipe está tratando e a proposta de solução. ⚠️ EXEMPLO ⚠️

[![Vídeo do projeto](images/video.png)](https://www.youtube.com/embed/70gGoFyGeqQ)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> O video de apresentação é voltado para que o público externo possa conhecer a solução. O formato é livre, sendo importante que seja apresentado o problema e a solução numa linguagem descomplicada e direta.
>
> Inclua um link para o vídeo do projeto.

## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Pets 

Permite a inclusão, leitura, alteração e exclusão de pets para o sistema

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Entre no seu perfil
  * Clique em "Meus Pets"
  * Clique em "Registrar um Pet"
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/funcionalidade_pets.png)

##### Funcionalidade 2 - Cadastro de ONG's

Permite a inclusão, leitura, alteração e exclusão de ONGS para o sistema


* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção ONGS
  * Cadastre a sua ONG
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/funcionalidade_ongs.jpg)

##### Funcionalidade 3 - Ferramenta de busca: 

Permite a inserir termos como nome do pet, raça ou palavras-chave. Aciona uma busca textual que pode ser combinada com filtros.

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e vá na barra de busca
  * Em seguida, escreva o que procura ou utilize os filtros para facilitar sua busca
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/Funcinalidades_busca.png)

##### Funcionalidade 4 - Perfil do usuário com suas respectivas informações: 

Permite o usuário ver suas inforamções, bem como alterá-las, além de ver o pets cadastros em seu usuário

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e vá na aba meu perfil
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/Funcinalidades_busca.png)

##### Funcionalidade 5 - Home do Site:

Tela inicial que os usuários logados estarão permitidos a ver e utilizar

* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Será direcionado para a Home do nosso site
* **Tela da funcionalidade**:
![Tela de Funcionalidade](images/HOME.ADOTEME.jpg)


## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Pets   

Pets da aplicação

```json
    {
      "nome": "Pipoca",
      "especie": "Cachorro",
      "raca": "Border Collie ",
      "idade": "5",
      "sexo": "Fêmea",
      "porte": "Grande",
      "peso": "19",
      "vacinado": "Sim",
      "vermifugado": "Sim",
      "castrado": "Sim",
      "condicao": "Nenhuma",
      "temperamento": "Dócil",
      "criancas": "Sim",
      "outrosPets": "Sim",
      "localizacao": "Rua Montanha Branca, 89",
      "id": "1"
    }
  
```
##### Estrutura de Dados - ONG's   

Pets da aplicação

```json
    {
      
      "id": 1,
      "nome": "Amigos dos Animais",
      "telefone": "(31) 99999-0001",
      "email": "contato@amigosanimais.org",
      "cidade": "Belo Horizonte",
      "categoria": "Adoção",
      "site": "https://www.amigosanimais.org",
      "responsavel": "Carla Souza",
      "cnpj": "12.345.678/0001-90",
      "fundacao": "2012-05-10",
      "descricao": "Trabalhamos com a adoção responsável de cães e gatos resgatados."
    
    }
  
```
##### Estrutura de Dados - Busca  

Pets da aplicação

```json
    {
      "nome": "Pipoca",
      "especie": "Cachorro",
      "raca": "Border Collie ",
      "idade": "5",
      "sexo": "Fêmea",
      "porte": "Grande",
      "peso": "19",
      "vacinado": "Sim",
      "vermifugado": "Sim",
      "castrado": "Sim",
      "condicao": "Nenhuma",
      "temperamento": "Dócil",
      "criancas": "Sim",
      "outrosPets": "Sim",
      "localizacao": "Rua Montanha Branca, 89",
      "id": "1"
    }
  
```

##### Estrutura de Dados - Meu Perfil 


```json
 "users": [
    {
      "id": 1,
      "nome": "Matheus Silva",
      "email": "matheus@email.com",
      "endereco": "Rua das Flores, 123",
      "celular": "(31) 98765-4321",
      "cpf": "123.456.789-00",
      "nomeUsuario": "matheus123",
      "senha": "senhaSegura",
      "fotoPerfil": "https://i.pravatar.cc/160?img=5",
      "petIDs": [1, 2]
    }
  ],
```


## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) 

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) 
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) 

# Referências

* https://www.adotepetz.com.br/
* https://www.amigonaosecompra.com.br/
* https://flammo.com.br/blog/persona-e-publico-alvo-qual-a-diferenca/
* https://resultadosdigitais.com.br/blog/persona-o-que-e/
* https://rockcontent.com/blog/personas/
* https://blog.hotmart.com/pt-br/como-criar-persona-negocio/
* https://www.atlassian.com/br/agile/project-management/user-stories
* https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac
* https://codificar.com.br/requisitos-funcionais-nao-funcionais/
