# Padel Social Network

https://psn-frontend.vercel.app/

## Bienvenidos a PSN, voy a explicar todo lo que podemos hacer en esta red social y gestor de partidos. ##

Al registraros tendréis acceso a la aplicación, donde tendréis un ranking con la puntuación de todos los jugadores. Estos puntos se consiguen ganando partidos, pero ¡ojo!, ganar partidos contra gente de menor puntuación
que tú te otorgará menos puntos que si ganas contra rivales más fuertes. A la hora de perder, funciona igual: perderás más puntos si pierdes contra jugadores con menos puntos que tú y ganarás más si estos tienen mayor puntuación.
Empiezas con 3 puntos y deberás jugar para poder subir en el ranking, donde podrás encontrar jugadores de tu nivel y hacer amistad con ellos para mejorar tu nivel. En la página de inicio te aparecerán los partidos pendientes de tus amigos,
para que puedas enterarte de cuándo les falta un jugador a alguno de ellos y unirte a los partidos. Lo mismo sucederá si tú creas un partido: le aparecerá a tus amistades para que puedan unirse y jugar contigo.
Tendrás acceso a la tienda, donde podrás comprar productos oficiales de PSN y productos nuevos ofrecidos por nuestra marca. Pero, además, tendrás la opción de poner a la venta tus propios productos; si has cambiado de pala y quieres vender la que tienes actualmente,
nuestra tienda es el lugar perfecto. A la hora de comprar a otros vendedores que no sean PSN verificado, recuerda mirar las puntuaciones, ya que son productos de segunda mano y es un acierto fiarte de la puntuación del vendedor.
Si quieres conocer nuestros patrocinadores e iniciativas, así como los valores de la empresa, puedes acceder a las secciones "Conócenos" y "Socios" para saber más.
En la página de inicio tendrás también un pequeño calendario que te avisará de tus partidos pendientes para que nunca se te olviden. ¡No queremos que dejes sin jugar a tus amigos en el último momento!

Esperamos que puedas disfrutar de la experiencia y estamos atentos a cualquier feedback. Siempre escuchamos a nuestros usuarios. ¡Suerte y a jugar!

## Tecnologias empleadas ## 
He utilizado la combinacion de Node.js, Javascript, MongoDB, mongoose, Express,Nodemailer,Multer,Websockets,Bcrypt, JWT.
Desglose de tecnologias relevantes:
- ## Nodemailer ##: He utilizado nodemailer para la creacion de un email de bienvenida.
- ## Cloudinary ##: Para gestionar la subida de archivos, debido a que al ser un servidor gratuito el que tenemos en render, los archivos se eliminan cuando se apaga el servidor.
- ## Multer ##: He utilizado multer para la subida de archivos, en nuestro caso concreto para gestionar la subida de la foto de perfil.
- ## Websocket ##: He utilizado WS, para la gestion de chats entre usuarios.
- ## Bcrypt ##: He utilizado Bcrypt para encriptar la contraseña.
- ## JWT ## : He utilizado JWT para la creacion del token y gestionar rutas restrigindas gracias a el.


## 🎾 Flujo del backend
En el backend podemos encontrar una correcta separacion por carpetas delegando funcionalidades concretas a cada seccion, tratando los esquemas en models, tanto de usuarios, como de partidos, mensajes y relaciones.
Tenemos la carpeta config donde tambien configuro la base de datos.
La carpeta rutas donde gestiono los endpoints que llamaran a unos controladores que a su vez llaman a unos servicios, donde defino la logica necesaria para el funcionamiento de nuestro backend y en consecuencia el front.
Una carpeta de validaciones donde trato las validaciones para la creacion de usuarios.
Una carpeta de middlewares donde trato los middlewares tanto de autenticacion como de errores basicos, que aplicaremos en las rutas necesarias, tanto en rutas como en app.js.
Una carpeta de Websockets, donde trato lo correspondiente para levantar estos y poder establecer el chat entre usuarios.

