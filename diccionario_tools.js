/* ================================================================
   DICCIONARIO & HERRAMIENTAS JURIDICAS  diccionario_tools.js
   Juridico Supra Legis  560+ terminos
   ================================================================ */

/* ---- DICCIONARIO JURIDICO COMPLETO ---- */
const DICCIONARIO_JURIDICO = {
    "abintestato": "Procedimiento judicial sobre la herencia y la adjudicación de los bienes de quien muere sin testar o con testamento nulo.",
    "abogado": "Licenciado en derecho que ofrece profesionalmente asesoramiento jurídico y ejerce la defensa de las partes en los procesos judiciales.",
    "absolución": "Sentencia de un juez o de un tribunal que declara inocente a un acusado o libre a un demandado.",
    "acción": "Facultad de acudir ante un órgano jurisdiccional para pedir la resolución de un conflicto.",
    "acreedor": "Persona que tiene derecho a pedir el cumplimiento de una obligación, especialmente a que se le pague una deuda.",
    "acta": "Documento oficial en el que se relata lo sucedido en una reunión, juicio o hecho.",
    "actor": "Persona que demanda en un proceso civil.",
    "adeudo": "Deuda que alguien tiene con otra persona o entidad.",
    "adjudicación": "Acto por el cual un órgano competente atribuye la propiedad de un bien a una persona.",
    "agravio": "Perjuicio que se causa a una persona en sus derechos o intereses.",
    "alegato": "Escrito o exposición oral que presenta un abogado para defender los derechos de su cliente.",
    "alzada": "Recurso que se interpone ante el superior jerárquico del órgano que dictó una resolución.",
    "amparo": "Procedimiento legal para la protección de los derechos constitucionales del ciudadano.",
    "apelación": "Recurso por el cual se solicita a un tribunal superior que anule o enmiende una sentencia dictada por uno inferior.",
    "apremiar": "Obligar a alguien, mediante mandamiento judicial, a que haga algo con prontitud.",
    "arbitraje": "Método de resolución de conflictos en el que las partes acuerdan someterse a la decisión de un tercero.",
    "arrendador": "Persona que da algo en arrendamiento.",
    "arrendatario": "Persona que toma algo en arrendamiento.",
    "atenuante": "Circunstancia que disminuye el grado de responsabilidad penal.",
    "audiencia": "Acto en el que un juez o tribunal escucha a las partes para decidir sobre un asunto.",
    "auto": "Resolución judicial motivada que decide cuestiones secundarias o previas en un proceso.",
    "autonomía": "Facultad de una entidad para gobernarse por sus propias leyes.",
    "aval": "Garantía que una persona presta a favor de otra para asegurar el cumplimiento de una obligación.",
    "beneficiario": "Persona que tiene derecho a recibir un beneficio o prestación.",
    "buena fe": "Principio general del derecho que consiste en el estado mental de honradez y convicción en cuanto a la verdad o rectitud de un acto.",
    "caducidad": "Extinción de un derecho o una acción por el transcurso del tiempo.",
    "capacidad": "Aptitud de una persona para ser titular de derechos y obligaciones y para ejercerlos.",
    "careo": "Diligencia procesal en la que se confronta a dos personas que han prestado declaraciones contradictorias.",
    "carga de la prueba": "Obligación que tiene una de las partes en un juicio de probar los hechos que afirma.",
    "carta poder": "Documento privado por el cual una persona autoriza a otra para que realice trámites en su nombre.",
    "casación": "Recurso extraordinario que tiene por objeto anular una sentencia definitiva.",
    "causa": "Motivo o fundamento que da origen a un proceso judicial o a una obligación.",
    "cédula": "Documento oficial que acredita la identidad de una persona o una notificación judicial.",
    "citación": "Acto por el cual se ordena a una persona comparecer ante una autoridad en un lugar y día determinados.",
    "cláusula": "Cada una de las disposiciones de un contrato o testamento.",
    "coacción": "Fuerza o violencia que se ejerce sobre una persona para obligarla a hacer algo.",
    "código": "Conjunto sistemático de leyes que regulan una materia determinada.",
    "cognición": "Conocimiento de un asunto por parte de un juez o tribunal.",
    "cohecho": "Delito cometido cuando un funcionario público solicita o acepta una dádiva a cambio de un acto relacionado con su cargo.",
    "colusión": "Pacto ilícito entre dos o más personas para causar perjuicio a un tercero.",
    "comparecencia": "Acto de presentarse ante una autoridad judicial o administrativa.",
    "competencia": "Facultad de un juez o autoridad para conocer de un asunto determinado.",
    "concesión": "Acto administrativo por el cual el Estado otorga a un particular el derecho de explotar un bien o servicio público.",
    "conciliación": "Acuerdo entre las partes para evitar un pleito o poner fin a uno ya iniciado.",
    "condonación": "Perdón o remisión de una deuda por parte del acreedor.",
    "confección": "Elaboración de un documento o contrato.",
    "confesión": "Declaración por la cual una persona reconoce un hecho que le es desfavorable.",
    "connivencia": "Disimulo o tolerancia en la culpa de otro.",
    "consejo": "Órgano consultivo o de gobierno.",
    "consenso": "Acuerdo producido por consentimiento de todos los miembros de un grupo o entre varias partes.",
    "consentimiento": "Manifestación de la voluntad conforme entre las partes.",
    "consignación": "Depósito judicial de la cosa o cantidad debida.",
    "constitucional": "Perteneciente o relativo a la constitución de un Estado.",
    "contencioso": "Asunto sometido a decisión judicial por existir conflicto entre las partes.",
    "contrato": "Acuerdo de voluntades que crea o transmite derechos y obligaciones.",
    "contravención": "Infracción de una ley, contrato o norma.",
    "costas": "Gastos procesales originados por un juicio.",
    "cuaderno": "Cada una de las secciones en que se divide un expediente judicial.",
    "cuantía": "Valor económico de un asunto litigioso.",
    "culpable": "Persona a la que se le imputa la responsabilidad de un delito o falta.",
    "daños y perjuicios": "Compensación económica por el menoscabo sufrido en el patrimonio o en la persona.",
    "dación": "Acto de dar o entregar algo.",
    "demandado": "Persona contra la que se interpone una demanda.",
    "demandante": "Persona que interpone una demanda.",
    "denuncia": "Acto por el cual se pone en conocimiento de la autoridad la comisión de un hecho presuntamente delictivo.",
    "deposición": "Declaración de un testigo en un proceso judicial.",
    "depósito": "Contrato por el cual se recibe una cosa ajena con la obligación de guardarla y restituirla.",
    "derecho": "Conjunto de normas que regulan la conducta humana y permiten resolver conflictos.",
    "desacato": "Infracción cometida al faltar al respeto a una autoridad.",
    "desahogo": "Presentación o realización de las pruebas en un juicio.",
    "desahucio": "Acto de desalojar a un inquilino de una finca por falta de pago o fin del contrato.",
    "desistimiento": "Abandono de una acción, derecho o proceso.",
    "detención": "Privación provisional de libertad por orden judicial o policial.",
    "dictamen": "Opinión técnica emitida por un perito sobre una materia.",
    "diligencia": "Acto procesal realizado por un juez o funcionario de justicia.",
    "dolo": "Voluntad deliberada de cometer un delito o de incumplir una obligación.",
    "domicilio": "Lugar de residencia física de una persona.",
    "donación": "Contrato por el cual una persona transfiere a otra, gratuitamente, una parte o la totalidad de sus bienes.",
    "edictal": "Publicación obligatoria de un acto judicial mediante edictos.",
    "ejecución": "Fase del proceso en la que se da cumplimiento a lo ordenado en la sentencia.",
    "ejecutoria": "Sentencia firme que ya no admite recurso alguno.",
    "embargo": "Retención de bienes por orden judicial para asegurar el pago de una deuda.",
    "emancipación": "Acto por el que se libera a un menor de la patria potestad o tutela.",
    "emplazamiento": "Notificación por la cual se fija un plazo para comparecer o realizar un acto procesal.",
    "enajenación": "Transferencia del dominio de una cosa a otra persona.",
    "endoso": "Declaración puesta detrás de un título valor para transmitirlo.",
    "enfiteusis": "Censo o contrato por el cual se cede el dominio útil de una finca a cambio de un canon anual.",
    "error": "Falso conocimiento o valoración de un hecho o norma jurídica.",
    "escrito": "Documento presentado por las partes ante el juez.",
    "escritura": "Documento público otorgado ante notario.",
    "estado civil": "Situación jurídica de una persona en relación con su familia y la sociedad (soltero, casado, etc.).",
    "estupro": "Delito consistente en tener acceso carnal con una persona valiéndose del engaño.",
    "evicción": "Pérdida de un derecho por sentencia firme y en virtud de un derecho anterior ajeno.",
    "exención": "Privilegio que libera a alguien de una carga u obligación.",
    "exhorto": "Comunicación de un juez a otro de igual jerarquía para que realice una diligencia.",
    "expediente": "Conjunto de todos los documentos y actuaciones relativos a un asunto judicial.",
    "extinción": "Cese de un derecho, obligación o relación jurídica.",
    "extradición": "Entrega de una persona refugiada en un país a las autoridades de otro que la reclama.",
    "falta": "Infracción de la ley de menor gravedad que un delito.",
    "fallo": "Parte dispositiva de una sentencia.",
    "fianza": "Garantía personal para asegurar el cumplimiento de una obligación.",
    "filiación": "Relación jurídica que une a los hijos con sus padres.",
    "fiscalía": "Órgano encargado de la investigación de delitos y ejercicio de la acción penal.",
    "folio": "Hoja de un libro o expediente.",
    "fraude": "Engaño económico con ánimo de lucro.",
    "fuerza mayor": "Acontecimiento imprevisible e inevitable que libera de responsabilidad.",
    "garante": "Persona que da garantía o fianza.",
    "gravamen": "Carga o impuesto que pesa sobre un bien o propiedad.",
    "hábeas corpus": "Derecho de todo detenido a ser llevado ante un juez para que decida sobre la legalidad de su arresto.",
    "herencia": "Conjunto de bienes, derechos y obligaciones que se transmiten por causa de muerte.",
    "hipoteca": "Derecho real que garantiza el cumplimiento de una obligación sobre bienes inmuebles.",
    "hurto": "Apoderamiento de cosa ajena sin violencia ni intimidación.",
    "idóneo": "Que tiene aptitud para algo.",
    "ignominia": "Deshonor o descrédito público.",
    "impugnación": "Acto de combatir la validez de un documento o resolución.",
    "imputación": "Atribución de un delito a una persona.",
    "incidente": "Cuestión que surge durante un proceso y debe ser resuelta antes de la sentencia principal.",
    "incumplimiento": "Falta de ejecución de lo pactado o mandado.",
    "indemnización": "Compensación económica por un daño causado.",
    "indiciado": "Persona sobre la que existen indicios de haber cometido un delito.",
    "indulto": "Gracia por la cual se perdona total o parcialmente una pena.",
    "infractor": "Persona que quebranta una ley o norma.",
    "inhibitoria": "Planteamiento ante un juez reclamando que deje de conocer un asunto por incompetencia.",
    "injuria": "Agravio u ofensa que lesiona la dignidad de una persona.",
    "inmueble": "Bien que no puede trasladarse por sí mismo ni ser trasladado.",
    "instancia": "Grado jurisdiccional en que se tramita un juicio.",
    "interdicto": "Procedimiento sumario para decidir sobre la posesión de una cosa.",
    "interés moratorio": "Interés que se paga por el retraso en el cumplimiento de una obligación.",
    "intestado": "Persona que muere sin dejar testamento válido.",
    "irretroactividad": "Principio por el cual la ley nueva no se aplica a hechos ocurridos antes de su entrada en vigor.",
    "juez": "Persona con autoridad para juzgar y sentenciar.",
    "juicio": "Proceso judicial ante un juez o tribunal.",
    "jurisdicción": "Poder o autoridad para juzgar y aplicar las leyes.",
    "jurisprudencia": "Criterio constante y uniforme de los tribunales en la aplicación de las leyes.",
    "jurado": "Grupo de ciudadanos que participan en la administración de justicia.",
    "justicia": "Principio moral que inclina a obrar y juzgar respetando la verdad y dando a cada uno lo que le corresponde.",
    "juzgado": "Órgano judicial unipersonal.",
    "lanzamiento": "Acto de ejecutar un desahucio.",
    "legado": "Disposición testamentaria a título particular.",
    "legatario": "Persona que recibe un legado.",
    "legitimación": "Aptitud para ser parte en un proceso determinado.",
    "lesión": "Daño o detrimento corporal o patrimonial.",
    "ley": "Norma jurídica dictada por la autoridad competente.",
    "licitación": "Procedimiento para adjudicar un contrato mediante ofertas públicas.",
    "litigio": "Pleito o disputa judicial.",
    "litigante": "Persona que es parte en un juicio.",
    "lucro cesante": "Ganancia que se deja de obtener por un acto ilícito o incumplimiento.",
    "magistrado": "Miembro de un tribunal superior de justicia.",
    "mala fe": "Actuación con dolo o intención de engañar.",
    "mandamiento": "Orden escrita dictada por un juez.",
    "mandato": "Contrato por el cual una persona encomienda a otra la gestión de uno o más negocios.",
    "manifestación": "Declaración voluntaria de hechos o voluntad.",
    "mediación": "Intervención de un tercero para ayudar a las partes a llegar a un acuerdo.",
    "medida cautelar": "Disposición adoptada para asegurar el resultado de un juicio.",
    "mercantil": "Perteneciente o relativo al comercio o a los mercaderes.",
    "ministerio público": "Órgano del Estado encargado de representar los intereses de la sociedad.",
    "mora": "Retraso culpable en el cumplimiento de una obligación.",
    "notificación": "Acto de comunicar formalmente una resolución.",
    "notario": "Funcionario público que da fe de los actos y contratos.",
    "nulidad": "Carencia de valor legal de un acto jurídico.",
    "obiter dicta": "Opinión expresada por un juez que no es esencial para la decisión del caso.",
    "obligación": "Vínculo jurídico que nos constriñe a pagar o hacer algo.",
    "oficio": "Documento oficial de comunicación administrativa o judicial.",
    "oneroso": "Contrato que implica cargas recíprocas para las partes.",
    "ordenanza": "Norma dictada por una autoridad administrativa.",
    "pacto": "Acuerdo o tratado entre dos o más personas o entidades.",
    "pago": "Cumplimiento de una obligación de dar una cantidad de dinero.",
    "papel sellado": "Papel oficial de uso obligatorio en ciertos documentos jurídicos.",
    "pariente": "Persona que tiene relación de parentesco con otra.",
    "parte": "Cada una de las personas que intervienen en un negocio jurídico o pleito.",
    "patrimonio": "Conjunto de bienes y derechos pertenecientes a una persona.",
    "patria potestad": "Derechos y deberes de los padres sobre sus hijos menores.",
    "pena": "Sanción impuesta por ley a quien comete un delito.",
    "perentorio": "Plazo que es último y no se puede prorrogar.",
    "peritaje": "Informe realizado por un experto sobre una materia.",
    "perito": "Persona experta en una ciencia, arte u oficio.",
    "perjuicio": "Daño causado a una persona o a sus bienes.",
    "personería": "Facultad de representar a otra persona en juicio o fuera de él.",
    "pignoración": "Acto de dar algo en prenda.",
    "plazo": "Tiempo fijado para realizar un acto.",
    "pleito": "Contienda judicial entre partes.",
    "pliego": "Documento que contiene condiciones o preguntas.",
    "pobreza": "Situación que permite litigar sin gastos si se carece de medios.",
    "poder": "Documento que otorga representación legal.",
    "posesión": "Poder de hecho que se ejerce sobre una cosa.",
    "precedente": "Decisión judicial previa que sirve de guía para casos futuros.",
    "preclusión": "Pérdida de una facultad procesal por no haberse ejercido en tiempo.",
    "prenda": "Derecho real de garantía sobre bienes muebles.",
    "prescripción": "Adquisición o pérdida de un derecho por el transcurso del tiempo.",
    "presunción": "Deducción de un hecho desconocido a partir de uno conocido.",
    "pretensión": "Lo que una parte solicita en su demanda.",
    "procedimiento": "Forma y orden de las actuaciones en un proceso.",
    "proceso": "Sucesión de actos dirigidos a la resolución de un conflicto por un juez.",
    "procurador": "Representante procesal de las partes.",
    "promover": "Iniciar o impulsar un trámite judicial.",
    "promulgar": "Publicar oficialmente una ley.",
    "prueba": "Medio para convencer al juez de la veracidad de los hechos.",
    "queja": "Recurso contra la inadmisión de otro recurso o por omisiones del juez.",
    "querella": "Acto por el cual un particular ejercita la acción penal como parte.",
    "quid pro quo": "Sustitución de una cosa por otra.",
    "ratificación": "Confirmación de un acto realizado previamente.",
    "rebeldía": "Situación del demandado que no comparece en el proceso.",
    "recisión": "Extinción de un contrato por lesión o causa legal.",
    "reconvención": "Contrademanda que el demandado interpone contra el actor.",
    "recurso": "Medio de impugnación de las resoluciones judiciales.",
    "recusación": "Acto de pedir que un juez no intervenga por duda de su imparcialidad.",
    "redención": "Liberación de una carga u obligación.",
    "reglamento": "Norma de rango inferior a la ley dictada por la administración.",
    "reivindicación": "Acción para recuperar la propiedad de una cosa.",
    "remate": "Subasta pública de bienes embargados.",
    "reparación": "Acción de remediar un daño causado.",
    "reposición": "Recurso ante el mismo juez que dictó la resolución.",
    "representación": "Actuar en nombre y por cuenta de otro.",
    "requerimiento": "Notificación imperativa para que alguien haga o deje de hacer algo.",
    "resolución": "Decisión de un juez o autoridad.",
    "responsabilidad": "Obligación de reparar el daño causado por un hecho propio o ajeno.",
    "restauración": "Restablecimiento de una situación anterior.",
    "retracto": "Derecho de adquirir una cosa vendida a un tercero.",
    "retroactividad": "Aplicación de la ley nueva a hechos pasados.",
    "revocación": "Acto de dejar sin efecto una resolución o mandato anterior.",
    "robo": "Apoderamiento de cosa ajena con violencia o intimidación.",
    "sala": "Cada una de las secciones en que se divide un tribunal superior.",
    "saneamiento": "Obligación del vendedor de garantizar la posesión legal y pacífica de la cosa.",
    "sanción": "Castigo impuesto por el incumplimiento de una norma.",
    "secretario": "Funcionario judicial que da fe de las actuaciones.",
    "secuestro": "Depósito judicial de bienes en litigio.",
    "sentencia": "Resolución definitiva de un juez o tribunal que pone fin al proceso.",
    "servidumbre": "Carga impuesta sobre un inmueble en beneficio de otro.",
    "siniestro": "Acontecimiento que causa un daño cubierto por un seguro.",
    "soborno": "Acción de corromper a alguien con dádivas.",
    "sobreseimiento": "Resolución que suspende o pone fin a un proceso sin decidir sobre el fondo.",
    "sugeto": "Persona que es titular de derechos u obligaciones.",
    "suerte principal": "Monto original de una deuda sin incluir intereses ni gastos.",
    "sumario": "Procedimiento judicial rápido o fase de instrucción en lo penal.",
    "supletorio": "Que sirve para suplir la falta de algo.",
    "suspender": "Detener temporalmente un proceso o ejecución.",
    "tacha": "Causa para invalidar o dudar de la declaración de un testigo.",
    "tasa": "Tributo que se paga por el uso de un servicio público.",
    "término": "Plazo fijado para realizar un acto procesal.",
    "testador": "Persona que hace testamento.",
    "testamento": "Acto por el cual una persona dispone de sus bienes para después de su muerte.",
    "testigo": "Persona que declara sobre hechos que conoce.",
    "título": "Documento que acredita un derecho o propiedad.",
    "tradición": "Entrega de la cosa con intención de transmitir la propiedad.",
    "trámite": "Cada uno de los pasos de un proceso administrativo o judicial.",
    "transacción": "Contrato por el cual las partes terminan una controversia mediante concesiones recíprocas.",
    "traslado": "Acto de dar conocimiento a una parte de lo pedido por la otra.",
    "tribunal": "Órgano pluripersonal encargado de impartir justicia.",
    "tutela": "Autoridad conferida para cuidar de la persona y bienes de un menor o incapacitado.",
    "usucapión": "Adquisición de la propiedad por la posesión continuada en el tiempo.",
    "usura": "Cobro de intereses excesivos.",
    "usufructo": "Derecho a disfrutar de bienes ajenos con la obligación de conservarlos.",
    "vacatio legis": "Plazo entre la publicación de una ley y su entrada en vigor.",
    "validez": "Cualidad de un acto que reúne los requisitos legales.",
    "vencimiento": "Fecha en que se hace exigible una obligación.",
    "venia": "Licencia o permiso de una autoridad.",
    "veredicto": "Decisión del jurado sobre los hechos.",
    "vía de apremio": "Procedimiento para la ejecución forzosa de una sentencia.",
    "vicio": "Defecto que anula o disminuye la validez de un acto.",
    "vigencia": "Cualidad de la ley o norma que está en vigor.",
    "vínculo": "Relación jurídica entre personas.",
    "vista": "Acto oral de un proceso judicial.",
    "viuda": "Mujer que ha perdido a su esposo.",
    "vocación": "Llamamiento a los herederos a una sucesión.",
    "voluntad": "Consentimiento o intención de realizar un acto.",
    "voto": "Manifestación de la opinión o voluntad en una decisión colectiva.",
    "yacente": "Situación de la herencia desde la muerte del causante hasta su aceptación.",
    "zona": "Ámbito territorial de una jurisdicción.",
    "abandono de hogar": "Acto por el cual uno de los cónyuges deja el domicilio conyugal sin causa justificada.",
    "aborto": "Interrupción del embarazo antes de que el feto sea viable, tipificado o permitido según la legislación aplicable.",
    "acatamiento": "Cumplimiento y obediencia de una resolución judicial o administrativa.",
    "accesion": "Derecho del propietario de una cosa a apropiarse de lo que se une a ella.",
    "acreedora hipotecaria": "Persona a cuyo favor está constituida una hipoteca como garantía de un crédito.",
    "acto administrativo": "Declaración de voluntad de la administración pública que produce efectos jurídicos.",
    "acto de comercio": "Operación comercial realizada con fines lucrativos regulada por el código de comercio.",
    "acto ilícito": "Conducta contraria a la ley que genera responsabilidad civil o penal.",
    "actualización": "Ajuste del valor de una cantidad de dinero conforme al índice de precios.",
    "adeudo fiscal": "Deuda contraída con el fisco o el Estado.",
    "adopción": "Acto jurídico por el que se establece una relación paterno-filial entre personas no unidas por vínculos biológicos.",
    "agravante": "Circunstancia que aumenta el grado de responsabilidad penal.",
    "agresión": "Acto de fuerza o violencia cometido contra una persona.",
    "albacea": "Persona encargada de cumplir la última voluntad del testador.",
    "alienación mental": "Perturbación grave de las facultades mentales que afecta la capacidad jurídica.",
    "allanamiento": "Aceptación por parte del demandado de la demanda interpuesta en su contra.",
    "allanamiento de morada": "Delito consistente en entrar sin autorización en el domicilio ajeno.",
    "amigable composición": "Método de resolución alternativa de conflictos por terceros designados por las partes.",
    "anatocismo": "Práctica de capitalizar intereses vencidos para generar nuevos intereses.",
    "anticresis": "Contrato por el que el deudor entrega un inmueble al acreedor para que perciba los frutos en pago.",
    "antijuridicidad": "Cualidad de una conducta contraria al ordenamiento jurídico.",
    "apoderado": "Persona que actúa en nombre de otra en virtud de un poder.",
    "aprehensión": "Detención física de una persona por la autoridad competente.",
    "arbitral": "Relativo al procedimiento de arbitraje.",
    "arraigo": "Medida cautelar que impide a una persona abandonar el país durante una investigación.",
    "aseguramiento": "Medida cautelar para preservar bienes o derechos durante un juicio.",
    "asociación civil": "Persona jurídica formada por individuos que se unen para fines no lucrativos.",
    "atipicidad": "Ausencia de los elementos del tipo penal en una conducta.",
    "aval bancario": "Garantía otorgada por una institución bancaria.",
    "banco de datos": "Conjunto organizado de información sujeto a protección legal.",
    "bienes gananciales": "Bienes adquiridos durante el matrimonio bajo sociedad conyugal.",
    "bienes muebles": "Bienes que pueden trasladarse de un lugar a otro.",
    "buena fe objetiva": "Estándar de conducta honesta y leal exigido por el derecho.",
    "cámara de comercio": "Organización que representa los intereses comerciales de sus miembros.",
    "capacidad procesal": "Aptitud para ser parte en un proceso judicial.",
    "carta de crédito": "Documento bancario que garantiza el pago a un beneficiario.",
    "causahabiente": "Persona que adquiere derechos de otra por transmisión.",
    "cese": "Terminación de una relación laboral o de un cargo.",
    "cesión de crédito": "Transmisión del derecho de crédito de un acreedor a un tercero.",
    "circulación": "Transmisión de títulos valores mediante endoso o entrega.",
    "citatorio": "Documento por el que se convoca a una persona a comparecer ante la autoridad.",
    "cláusula arbitral": "Estipulación en un contrato que somete controversias al arbitraje.",
    "cláusula penal": "Estipulación que fija anticipadamente la indemnización por incumplimiento.",
    "cobro de lo indebido": "Acción para recuperar lo pagado sin causa legal.",
    "codeudor": "Persona que comparte una deuda con otra.",
    "código de comercio": "Ordenamiento legal que regula las relaciones mercantiles.",
    "coerción": "Presión física o moral para obligar a alguien a actuar.",
    "comiso": "Confiscación de bienes relacionados con un delito.",
    "compensación": "Extinción de obligaciones recíprocas hasta el monto de la menor.",
    "competencia desleal": "Prácticas comerciales contrarias a los usos honestos.",
    "compraventa": "Contrato por el que el vendedor transfiere la propiedad al comprador a cambio de un precio.",
    "concurso de acreedores": "Procedimiento colectivo para la distribución del patrimonio del deudor insolvente.",
    "condena condicional": "Suspensión de la ejecución de la pena bajo determinadas condiciones.",
    "condición resolutoria": "Evento futuro e incierto cuya realización extingue un derecho.",
    "condición suspensiva": "Evento futuro e incierto del que depende el nacimiento de un derecho.",
    "conducta típica": "Comportamiento que encuadra en la descripción de un tipo penal.",
    "confiscación": "Privación de bienes por la autoridad sin compensación.",
    "conmutación de pena": "Sustitución de una pena más grave por otra más leve.",
    "conocimiento de embarque": "Título valor que acredita el contrato de transporte marítimo.",
    "consolidación": "Reunión en una sola persona de las calidades de acreedor y deudor.",
    "consorcio": "Agrupación de empresas unidas para un fin común.",
    "contingencia laboral": "Riesgo o eventualidad en la relación de trabajo.",
    "contradicción de tesis": "Procedimiento ante la SCJN para unificar criterios jurisprudenciales contradictorios.",
    "contrato de adhesión": "Contrato cuyas cláusulas están predispuestas por una sola parte.",
    "contrato de obra": "Convenio en que una parte se obliga a ejecutar una obra por precio cierto.",
    "contrato de prestación de servicios": "Acuerdo para la realización de actividades a cambio de honorarios.",
    "convención": "Acuerdo entre partes o entre Estados.",
    "convenio homologado": "Acuerdo entre las partes reconocido y aprobado por el juez con valor de sentencia.",
    "cosa ajena": "Bien que pertenece a una persona distinta del poseedor.",
    "costo de oportunidad": "Valor de la mejor alternativa a la que se renuncia en una decisión.",
    "curador": "Persona designada para asistir o representar a un incapaz mayor de edad.",
    "custodia compartida": "Régimen en que ambos progenitores comparten el cuidado de los hijos.",
    "daño emergente": "Pérdida efectiva sufrida en el patrimonio a consecuencia de un hecho.",
    "daño moral": "Afectación a los sentimientos, afectos, creencias o dignidad de una persona.",
    "declaración jurada": "Manifestación de hechos o circunstancias hecha bajo protesta de decir verdad.",
    "declaración unilateral de voluntad": "Acto jurídico que obliga a quien lo emite sin necesidad de aceptación.",
    "decomiso": "Incautación de bienes por mandato judicial.",
    "defensa técnica": "Asistencia de un profesional del derecho en un proceso.",
    "deflación": "Reducción generalizada de los precios con efectos sobre las obligaciones.",
    "delegación": "Sustitución de un deudor por otro con consentimiento del acreedor.",
    "delito continuado": "Delito formado por varios actos similares ejecutados con una misma resolución criminal.",
    "delito culposo": "Delito cometido por imprudencia o negligencia sin intención de causarlo.",
    "delito doloso": "Delito cometido con intención y conocimiento de la ilicitud.",
    "delito flagrante": "Delito cometido en presencia de testigos o inmediatamente después de perpetrado.",
    "demanda reconvencional": "Contrademanda interpuesta por el demandado contra el actor.",
    "deposición testimonial": "Declaración de un testigo ante la autoridad.",
    "derechos reales": "Derechos que otorgan poder directo e inmediato sobre una cosa.",
    "desafuero": "Procedimiento para retirar la inmunidad a un legislador o funcionario.",
    "descuento": "Reducción de una cantidad exigible. En derecho cambiario: adquisición anticipada de créditos.",
    "desheredación": "Privación de la herencia a un heredero por causa legal.",
    "desistimiento de instancia": "Abandono del proceso sin desistir de la acción.",
    "dictamen pericial": "Opinión técnica emitida por un experto designado en juicio.",
    "disolución de sociedad": "Proceso legal por el que una sociedad termina sus operaciones.",
    "divorcio necesario": "Disolución del matrimonio por causa imputable a uno de los cónyuges.",
    "divorcio voluntario": "Disolución del matrimonio por acuerdo mutuo de los cónyuges.",
    "doble instancia": "Principio procesal que garantiza la posibilidad de apelar ante tribunal superior.",
    "documentos privados": "Documentos suscritos por particulares sin intervención de fedatario.",
    "documentos públicos": "Documentos expedidos por autoridad o fedatario público con valor pleno.",
    "dolo civil": "Engaño o maquinación para inducir a alguien a contratar en su perjuicio.",
    "domicilio conyugal": "Lugar donde conviven habitualmente los cónyuges.",
    "donación remuneratoria": "Donación que recompensa servicios prestados.",
    "efecto devolutivo": "Efecto de un recurso que permite al tribunal superior revisar la resolución.",
    "efecto suspensivo": "Efecto de un recurso que impide la ejecución de la resolución impugnada.",
    "ejecutivo mercantil": "Juicio para el cobro de deudas documentadas en títulos ejecutivos mercantiles.",
    "el juicio oral civil": "Proceso civil moderno basado en audiencias orales ante el juez.",
    "enajenar": "Transferir la propiedad de un bien a otra persona.",
    "encubrimiento": "Delito de ayudar a ocultar a un delincuente o los efectos del delito.",
    "endosante": "Persona que transmite un título valor mediante endoso.",
    "endosatario": "Persona a cuyo favor se realiza el endoso de un título valor.",
    "enriquecimiento ilícito": "Incremento patrimonial no justificado de un servidor público.",
    "enriquecimiento sin causa": "Aumento del patrimonio de una persona a expensas de otra sin fundamento legal.",
    "entidad federativa": "Cada uno de los estados que conforman la federación mexicana.",
    "escritura pública": "Instrumento notarial que da fe pública a actos y contratos.",
    "estafa": "Delito de obtener un beneficio económico mediante engaño.",
    "estado de derecho": "Sistema político en que el gobierno y los ciudadanos se sujetan a la ley.",
    "estado de necesidad": "Situación que justifica una conducta típica para evitar un mal mayor.",
    "excepción de falta de legitimación": "Defensa procesal que niega la capacidad de la parte para actuar en juicio.",
    "excepción procesal": "Defensa formal que alega deficiencias del procedimiento.",
    "expropiación": "Privación de la propiedad privada por causa de utilidad pública.",
    "extinción de dominio": "Procedimiento por el que el Estado priva de bienes vinculados a actividades ilícitas.",
    "factura": "Documento que acredita una operación comercial.",
    "falsedad de documentos": "Delito de alterar o fabricar documentos para engañar.",
    "falsificación": "Imitación fraudulenta de documentos, firmas o bienes protegidos.",
    "fideicomiso": "Acto jurídico por el que una persona destina bienes a un fin específico a través de un fiduciario.",
    "fideicomitente": "Persona que constituye un fideicomiso aportando bienes.",
    "fiduciario": "Institución que recibe y administra los bienes del fideicomiso.",
    "firma electrónica": "Datos electrónicos que identifican al firmante y tienen validez legal.",
    "flagrancia equiparada": "Situación en que la persona es señalada por la víctima inmediatamente después del delito.",
    "fondo legal de reserva": "Reserva obligatoria constituida por las sociedades mercantiles.",
    "forma jurídica": "Requisito externo que debe cumplir un acto para tener validez.",
    "fortuito": "Acontecimiento imprevisto que nadie puede evitar.",
    "franquicia": "Acuerdo por el que una empresa cede el uso de su marca a otra bajo condiciones.",
    "fraude procesal": "Engaño cometido en el desarrollo de un proceso judicial.",
    "fuero": "Inmunidad de que gozan ciertas personas por razón de su cargo.",
    "fuero constitucional": "Protección que impide el enjuiciamiento de servidores públicos sin declaración de procedencia.",
    "garantía de audiencia": "Derecho constitucional a ser oído antes de ser afectado por un acto de autoridad.",
    "garantía de legalidad": "Derecho a que los actos de autoridad se funden y motiven en ley.",
    "gestión de negocios": "Administración de asuntos ajenos sin mandato expreso.",
    "habitación": "Derecho de usar una casa ajena para vivir.",
    "hipoteca industrial": "Gravamen sobre bienes de una empresa para garantizar un crédito.",
    "homicidio calificado": "El cometido con premeditación, alevosía, ventaja o traición.",
    "homicidio culposo": "El causado sin intención por imprudencia o negligencia.",
    "honorarios": "Retribución por los servicios de profesionales liberales.",
    "huella digital": "Marca dactilar usada como medio identificador.",
    "imputabilidad": "Capacidad de la persona de comprender y dirigir su conducta conforme a derecho.",
    "inembargabilidad": "Cualidad de los bienes que no pueden ser objeto de embargo.",
    "inexistencia": "Estado del acto jurídico que carece de elementos esenciales.",
    "inhibición": "Suspensión de la actividad de un juez por estimarse incompetente.",
    "inicio de la acción penal": "Momento en que el MP ejerce la acción penal ante el juez.",
    "inmatriculación": "Primera inscripción de un inmueble en el Registro Público de la Propiedad.",
    "inscripción registral": "Asiento en el registro público de un acto o derecho.",
    "insolvencia": "Estado de quien no puede hacer frente a sus obligaciones.",
    "instrucción": "Fase procesal en que se reúnen los elementos para el juicio.",
    "interdicción": "Privación judicial de la capacidad para administrar bienes.",
    "interés legal": "Interés fijado por la ley a falta de pacto.",
    "interpretación auténtica": "Interpretación de la ley hecha por el propio legislador.",
    "inventario": "Relación detallada de bienes pertenecientes a una herencia o sociedad.",
    "irrenunciabilidad": "Cualidad de los derechos que no pueden ser objeto de renuncia.",
    "juicio arbitral": "Proceso resuelto por árbitros designados por las partes.",
    "juicio ejecutivo": "Proceso de cobro de deuda cierta, líquida y exigible.",
    "juicio hipotecario": "Proceso para ejecutar una garantía hipotecaria.",
    "juicio oral mercantil": "Proceso mercantil basado en audiencias orales.",
    "juicio sumarísimo": "Proceso de trámite muy breve y simplificado.",
    "jurisconsulto": "Jurista especializado en asesoría e interpretación del derecho.",
    "laudo arbitral": "Resolución emitida por el árbitro que pone fin al arbitraje.",
    "lealtad procesal": "Deber de actuar con buena fe y veracidad en el proceso.",
    "legitimación activa": "Aptitud para ser parte actora en un proceso.",
    "legitimación pasiva": "Aptitud para ser parte demandada en un proceso.",
    "lesiones": "Daño físico causado a una persona, tipificado como delito.",
    "letra de cambio": "Título valor que contiene una orden incondicional de pago.",
    "ley federal": "Norma jurídica de aplicación en todo el territorio nacional.",
    "licitador": "Persona que participa en una subasta o licitación.",
    "liquidación": "Proceso de extinción de una sociedad o de una obligación.",
    "litisconsorcio": "Pluralidad de partes actoras o demandadas en un proceso.",
    "litispendencia": "Existencia de un proceso pendiente que impide tramitar otro igual.",
    "mandatario": "Persona que actúa por encargo de otra.",
    "maniobra dolosa": "Actuación engañosa para obtener un beneficio ilícito.",
    "matrimonio": "Institución jurídica que une a dos personas creando derechos y obligaciones.",
    "medio de apremio": "Mecanismo coercitivo que usa el juez para hacer cumplir sus resoluciones.",
    "menor de edad": "Persona que no ha alcanzado la mayoría de edad legal.",
    "mercancía": "Bien destinado al comercio.",
    "minuta": "Borrador o resumen de un acuerdo o contrato.",
    "modalidad": "Condición o término que modifica los efectos de un acto jurídico.",
    "mora del acreedor": "Situación en que el acreedor se niega injustificadamente a aceptar el pago.",
    "mutuo": "Contrato de préstamo de bienes consumibles con obligación de restituir.",
    "negocio jurídico": "Acto voluntario que produce efectos jurídicos queridos por las partes.",
    "nombramiento": "Designación de una persona para un cargo o función.",
    "norma jurídica": "Regla de conducta obligatoria establecida por el Estado.",
    "notaría": "Oficina donde el notario ejerce su función.",
    "novación": "Extinción de una obligación por otra que la sustituye.",
    "objeto del contrato": "Cosa o hecho sobre el que recae la obligación contractual.",
    "objeto ilícito": "Objeto del contrato contrario a la ley, moral o buenas costumbres.",
    "obliterar": "Cancelar o inutilizar un documento o sello.",
    "oferta pública": "Propuesta dirigida al público para contratar.",
    "oficio judicial": "Comunicación oficial de un órgano jurisdiccional.",
    "omisión": "Falta de realización de un acto jurídicamente exigible.",
    "opción de compra": "Derecho a adquirir un bien en determinadas condiciones dentro de un plazo.",
    "oposición": "Recurso para combatir medidas cautelares o actos procesales.",
    "orden de aprehensión": "Mandamiento judicial para detener a una persona.",
    "orden pública": "Conjunto de principios fundamentales que no pueden ser derogados por acuerdo privado.",
    "pacto comisorio": "Cláusula que permite rescindir el contrato por incumplimiento.",
    "pacto de non petendo": "Compromiso de no reclamar una deuda.",
    "pagaré": "Título valor que contiene la promesa incondicional de pago.",
    "parentesco": "Vínculo jurídico entre personas por consanguinidad, afinidad o adopción.",
    "pena vitalicia": "Condena de privación de libertad de por vida.",
    "pensión civil": "Prestación económica establecida judicialmente.",
    "perdón del ofendido": "Manifestación de voluntad de la víctima que extingue la acción penal en ciertos delitos.",
    "perentoriedad": "Carácter improrrogable de algunos plazos procesales.",
    "permuta": "Contrato por el que las partes intercambian bienes.",
    "persona jurídica": "Ente creado por la ley con capacidad de derechos y obligaciones.",
    "persona moral": "Término mexicano para designar a las personas jurídicas.",
    "plantas y árboles": "Bienes inmuebles por naturaleza regulados en el código civil.",
    "poderdante": "Persona que otorga poder a otra para que actúe en su nombre.",
    "posesión de buena fe": "Posesión ejercida creyendo legítimamente ser propietario.",
    "posesión de mala fe": "Posesión ejercida sabiendo que no se tiene derecho.",
    "posesión originaria": "Posesión que no deriva de ninguna otra.",
    "posesión precaria": "Posesión ejercida por mera tolerancia del dueño.",
    "prelación": "Orden de preferencia entre créditos para su cobro.",
    "presupuesto procesal": "Condición necesaria para la válida constitución del proceso.",
    "prima facie": "Expresión latina que significa a primera vista, con los elementos disponibles.",
    "principio de congruencia": "El juez debe resolver sobre lo pedido y solo lo pedido.",
    "principio de contradicción": "Toda prueba y argumento debe ser conocido por la contraparte.",
    "principio de inmediación": "El juez debe tener contacto directo con pruebas y partes.",
    "principio de legalidad": "Las autoridades solo pueden actuar conforme a lo expresamente autorizado por ley.",
    "principio pro persona": "En derechos humanos, aplicar la norma más favorable a la persona.",
    "proforma": "Documento provisional que anticipa el contenido de uno definitivo.",
    "promitente": "Persona que hace una promesa en un contrato preliminary.",
    "promovente": "Persona que promueve un proceso, recurso o trámite.",
    "propiedad intelectual": "Conjunto de derechos sobre creaciones del intelecto.",
    "prorroga de jurisdiccion": "Extensión de la competencia de un juez por acuerdo de las partes.",
    "protesto": "Acto formal que acredita la falta de pago de un título valor.",
    "prueba circunstancial": "Prueba indirecta que permite inferir un hecho desconocido.",
    "prueba documental": "Prueba consistente en documentos públicos o privados.",
    "prueba pericial": "Prueba que requiere conocimientos técnicos especiales.",
    "prueba testimonial": "Declaración de testigos con conocimiento directo de los hechos.",
    "publicidad registral": "Principio por el que los asientos del registro son cognoscibles por todos.",
    "querellante": "Persona que formula querella en un proceso penal.",
    "quiebra": "Estado jurídico del deudor incapaz de pagar sus obligaciones comerciales.",
    "radar": "En derecho: término coloquial para vigilancia o rastreo electrónico.",
    "ratificación de firma": "Acto por el que se confirma la autenticidad de una firma ante autoridad.",
    "rebeldía procesal": "Situación del demandado que no comparece a juicio.",
    "recidivismo": "Reincidencia en conductas delictivas.",
    "reincidencia": "Circunstancia agravante de haber cometido antes delito del mismo tipo.",
    "reintegro": "Devolución de una cantidad pagada indebidamente.",
    "renuncia de derechos": "Abandono voluntario de un derecho disponible.",
    "rescate": "Recuperación de un bien dado en garantía mediante pago.",
    "resolución firme": "Resolución que no admite más recursos.",
    "responsabilidad civil objetiva": "Responsabilidad que surge independientemente de la culpa, por actividades riesgosas.",
    "responsabilidad patrimonial del estado": "Obligación del Estado de indemnizar daños causados por su actividad.",
    "restitución": "Devolución de una cosa a quien la poseía legítimamente.",
    "retroalimentación jurídica": "Revisión y corrección continua de criterios normativos.",
    "riesgo de trabajo": "Accidente o enfermedad surgido en el desempeño laboral.",
    "rúbrica": "Parte de la firma consistente en rasgos sin letras.",
    "secuestro convencional": "Depósito de bienes en litigio en manos de un tercero acordado por las partes.",
    "servidumbre de paso": "Derecho de cruzar el predio ajeno para acceder al propio.",
    "sigilo profesional": "Deber del abogado de guardar confidencialidad del cliente.",
    "simulación": "Acuerdo para aparentar un negocio jurídico que en realidad no existe.",
    "sindicatura": "Cargo del síndico en un concurso mercantil.",
    "síndico": "Persona designada para administrar el patrimonio en proceso de quiebra.",
    "sociedad anónima": "Sociedad mercantil cuyo capital se divide en acciones.",
    "sociedad civil": "Persona jurídica formada por socios que ejercen profesión o actividad no lucrativa.",
    "sociedad conyugal": "Régimen matrimonial en que los bienes son comunes.",
    "solvencia": "Capacidad económica de cumplir las obligaciones.",
    "subrogación": "Sustitución de una persona o cosa por otra en una relación jurídica.",
    "subsidiaridad": "Principio por el que el Estado solo actúa cuando las personas no pueden.",
    "sugeto de derecho": "Persona titular de derechos y obligaciones.",
    "supletoriedad": "Aplicación de una norma cuando la principal no regula el caso.",
    "suspensión condicional": "Interrupción temporal de un proceso sujeta a condiciones.",
    "tabla de depreciación": "Criterio para calcular el desgaste de bienes en el tiempo.",
    "tasa de interés": "Porcentaje aplicado sobre un capital como precio del dinero.",
    "tenencia": "Posesión material de un bien sin título de dominio.",
    "terminación anticipada": "Extinción de un contrato antes del plazo pactado.",
    "testigo de cargo": "Testigo que declara en contra del acusado.",
    "testigo de descargo": "Testigo que declara a favor del acusado.",
    "título de crédito": "Documento que incorpora un derecho literal y autónomo.",
    "título ejecutivo": "Documento que por ley tiene fuerza para iniciar ejecución judicial.",
    "totalidad patrimonial": "Conjunto de todos los bienes y deudas de una persona.",
    "tracto sucesivo": "Principio registral de continuidad en las inscripciones.",
    "traición a la patria": "Delito grave contra la seguridad del Estado.",
    "traslaticio de dominio": "Acto cuya función es transferir la propiedad.",
    "tribunal arbitral": "Órgano de árbitros que resuelve controversias.",
    "tribunal colegiado": "Órgano jurisdiccional integrado por varios magistrados.",
    "tribunal de alzada": "Tribunal superior que conoce de apelaciones.",
    "tutela procesal": "Protección que brinda el proceso judicial a los derechos de las partes.",
    "unanimidad": "Acuerdo de todos los integrantes de un órgano.",
    "unidad familiar": "Grupo de personas unidas por vínculos familiares reconocidos legalmente.",
    "uso": "Derecho real de servirse de cosa ajena con limitación a las necesidades del usuario.",
    "usurero": "Quien presta dinero cobrando intereses excesivos.",
    "venia materna": "Autorización de la madre para que el menor realice actos jurídicos.",
    "venta judicial": "Enajenación de bienes ordenada por el juez en proceso de ejecución.",
    "verificación": "Comprobación oficial de hechos o datos.",
    "vicios ocultos": "Defectos en una cosa que la hacen impropia para su uso y que no eran visibles.",
    "violación de correspondencia": "Delito de abrir o interceptar comunicaciones ajenas.",
    "vista fiscal": "Traslado al fiscal para que opine sobre un asunto.",
    "voluntad testamentaria": "Manifestación de voluntad en un testamento.",
    "zona prohibida": "Área donde por ley está vedada la propiedad de extranjeros.",

    /* ── MATERIA LABORAL ── */
    "laudo": "Resolución definitiva que emite el Tribunal Laboral o la Junta de Conciliación y Arbitraje para resolver un conflicto de trabajo.",
    "laudo laboral": "Resolución definitiva de la autoridad del trabajo que pone fin a un conflicto individual o colectivo de trabajo.",
    "laudo absolutorio": "Laudo que absuelve al patrón de las prestaciones que reclamó el trabajador.",
    "laudo condenatorio": "Laudo que condena al patrón a pagar las prestaciones reclamadas por el trabajador.",
    "junta de conciliacion y arbitraje": "Órgano tripartita (gobierno, patrones, trabajadores) que conocía conflictos laborales antes de la reforma de 2019.",
    "tribunal laboral": "Órgano del Poder Judicial que resuelve conflictos de trabajo desde la reforma de 2019.",
    "reinstalacion": "Obligación del patrón de restituir al trabajador en su puesto tras un despido injustificado declarado así por laudo.",
    "indemnizacion constitucional": "Pago de tres meses de salario más 20 días de salario por año de servicios (Art. 123 CF / Art. 50 LFT).",
    "salarios caidos": "Salarios que el patrón debe cubrir desde el despido hasta el cumplimiento del laudo, con el tope del Art. 48 LFT.",
    "finiquito": "Documento que acredita el pago de las prestaciones generadas al trabajador al término de la relación laboral.",
    "liquidacion laboral": "Pago total de prestaciones al trabajador despedido injustificadamente: indemnización constitucional + 20 días/año + proporcionales.",
    "partes proporcionales": "Fracción del aguinaldo, vacaciones y prima vacacional correspondiente al tiempo laborado en el año.",
    "prima vacacional": "Derecho del trabajador a recibir al menos el 25% del salario durante el período vacacional (Art. 80 LFT).",
    "aguinaldo": "Prestación anual equivalente a no menos de 15 días de salario pagadera antes del 20 de diciembre (Art. 87 LFT).",
    "vacaciones laborales": "Período de descanso anual con goce de sueldo. Desde 2023 mínimo 12 días desde el primer año (Art. 76 LFT).",
    "horas extras": "Tiempo laborado más allá de la jornada legal; se pagan al doble las primeras 9 horas semanales y al triple el excedente.",
    "despido injustificado": "Terminación de la relación laboral por voluntad del patrón sin causa legal que lo justifique.",
    "despido justificado": "Terminación fundada en una causa del Art. 47 LFT, sin responsabilidad para el patrón.",
    "rescision laboral": "Terminación de la relación laboral por causa imputable a una de las partes (Arts. 47 y 51 LFT).",
    "renuncia voluntaria": "Decisión unilateral del trabajador de dar por terminada la relación de trabajo.",
    "contrato colectivo de trabajo": "Convenio entre sindicato(s) y patrón(es) que establece condiciones de trabajo.",
    "contrato individual de trabajo": "Acuerdo entre trabajador y patrón que establece la relación y condiciones de trabajo.",
    "sindicato": "Organización de trabajadores o patrones para la defensa y mejora de sus condiciones laborales.",
    "huelga": "Suspensión temporal y colectiva del trabajo por acuerdo de los trabajadores.",
    "patron": "Persona física o moral que utiliza los servicios de uno o más trabajadores (Art. 10 LFT).",
    "trabajador": "Persona física que presta un servicio personal subordinado a un patrón (Art. 8 LFT).",
    "salario minimo": "Retribución mínima que debe recibir un trabajador por su jornada de trabajo (Art. 90 LFT).",
    "salario integrado": "Salario que incluye cuota diaria más partes proporcionales de aguinaldo, vacaciones y prima vacacional.",
    "imss": "Instituto Mexicano del Seguro Social: organismo de seguridad social de los trabajadores del sector privado.",
    "infonavit": "Instituto del Fondo Nacional de la Vivienda para los Trabajadores: otorga créditos de vivienda.",
    "afore": "Administradora de Fondos para el Retiro: administra los fondos de retiro de los trabajadores.",
    "aportaciones patronales": "Contribuciones que el patrón hace al IMSS, INFONAVIT y SAR por cuenta del trabajador.",
    "riesgo de trabajo": "Accidentes y enfermedades a que están expuestos los trabajadores en ejercicio de su trabajo (Art. 473 LFT).",
    "enfermedad de trabajo": "Estado patológico derivado de una causa que tiene origen o motivo en el trabajo.",
    "accidente de trabajo": "Toda lesión orgánica o perturbación funcional producida repentinamente o por esfuerzo en el trabajo.",
    "conciliacion laboral": "Etapa obligatoria previa a la demanda laboral ante los Centros de Conciliación desde la reforma de 2019.",
    "centro de conciliacion": "Organismo prejudicial laboral creado por la reforma de 2019, obligatorio antes de demandar.",
    "outsourcing": "Subcontratación de servicios; regulado desde 2021 con importantes restricciones en LFT y leyes fiscales.",
    "jornada laboral": "Tiempo durante el cual el trabajador está a disposición del patrón: diurna 8h, nocturna 7h, mixta 7.5h.",
    "revision contractual": "Proceso por el que sindicato y patrón actualizan el contrato colectivo de trabajo.",
    "revision": "1) En materia laboral: actualización periódica de salarios o condiciones. 2) En amparo: recurso ante tribunal superior. 3) En general: nuevo examen de una resolución.",
    "revision salarial": "Negociación anual entre sindicato y patrón para incrementar los salarios pactados.",
    "emplazamiento a huelga": "Acto formal por el que el sindicato notifica al patrón la posibilidad de estallar una huelga.",
    "oferta de trabajo laboral": "Proposición del patrón al trabajador despedido para evitar la condena a salarios caídos (Art. 48 LFT).",
    "ley federal del trabajo": "Ordenamiento reglamentario del Art. 123 Constitucional que regula las relaciones obrero-patronales.",
    "salario base de cotizacion": "Monto base para calcular cuotas al IMSS; incluye percepciones ordinarias del trabajador.",
    "prestaciones de ley": "Derechos mínimos que la LFT garantiza: vacaciones, aguinaldo, prima vacacional, IMSS, INFONAVIT, etc.",
    "incapacidad temporal": "Imposibilidad derivada de enfermedad o accidente para prestar el trabajo; el IMSS la subsidia.",
    "incapacidad permanente": "Disminución de la capacidad de trabajo de carácter definitivo (Art. 477 LFT).",
    "tabla de valuacion de incapacidades": "Tabla que determina el porcentaje de incapacidad permanente según la lesión sufrida.",

    /* ── MATERIA PENAL ── */
    "imputado": "Persona a quien se atribuye la comisión de un delito en el sistema acusatorio adversarial.",
    "acusado": "Persona contra quien se formulan cargos formalmente ante el juez.",
    "victima": "Persona que directamente sufre el daño causado por el delito.",
    "ofendido": "Persona con derecho a la reparación del daño aunque no haya sufrido directamente el delito.",
    "carpeta de investigacion": "Expediente digital integrado por el Ministerio Público en el sistema acusatorio.",
    "audiencia inicial": "Primera audiencia del proceso penal acusatorio: formulación de cargos, situación jurídica y plazos.",
    "audiencia intermedia": "Audiencia de depuración probatoria para preparar el juicio oral.",
    "juicio oral penal": "Etapa final del proceso acusatorio donde se desahogan pruebas y se dicta sentencia.",
    "vinculacion a proceso": "Resolución que determina la continuación del proceso (equivale al auto de formal prisión en el sistema anterior).",
    "auto de formal prision": "Resolución que en el sistema mixto sujeta al inculpado a proceso.",
    "prision preventiva": "Medida cautelar que priva de libertad al imputado durante el proceso.",
    "prision preventiva justificada": "Privación de libertad para delitos del catálogo constitucional (Art. 19 CPEUM).",
    "prision preventiva oficiosa": "Privación de libertad que el juez decreta de oficio para delitos graves.",
    "libertad bajo caucion": "Libertad del imputado mediante garantía económica.",
    "reparacion del daño": "Obligación del sentenciado de restituir, pagar daños materiales y morales causados por el delito.",
    "sobreseimiento penal": "Resolución que pone fin al proceso sin condenar ni absolver, por falta de pruebas u otras causas.",
    "delito doloso": "Delito cometido con la intención de causar el resultado típico.",
    "delito culposo": "Delito cometido sin intención pero por imprudencia, negligencia o impericia.",
    "flagrante delito": "Situación en que el delincuente es sorprendido en el momento de cometer el delito.",
    "caso urgente": "Situación que permite al MP detener sin orden judicial ante riesgo de fuga en delito grave.",
    "orden de aprehension": "Mandamiento judicial que ordena la detención del imputado.",
    "extorsion": "Obligar a alguien mediante violencia o intimidación a entregar bienes o dinero.",
    "violencia familiar": "Conductas abusivas en el ámbito doméstico tipificadas como delito.",
    "privacion ilegal de la libertad": "Retener o detener a una persona sin autorización legal.",
    "abuso sexual": "Actos sexuales sin el consentimiento de la víctima.",
    "robo con violencia": "Apoderamiento de cosa ajena usando violencia física o moral.",
    "allanamiento de morada": "Entrada sin consentimiento en domicilio ajeno.",
    "daño en propiedad ajena": "Destrucción o deterioro de bienes de otras personas.",
    "lavado de dinero": "Ocultar o disfrazar el origen ilícito de recursos económicos.",
    "delincuencia organizada": "Asociación de tres o más personas para cometer delitos de manera permanente.",
    "legitima defensa": "Causa de justificación que excluye la responsabilidad cuando se actúa para repeler una agresión.",
    "tentativa de delito": "Inicio de ejecución del delito que no llega a consumarse por causas ajenas al autor.",
    "tipicidad": "Adecuación de la conducta al tipo penal descrito en la ley penal.",
    "antijuridicidad": "Contradicción entre la conducta y el ordenamiento jurídico.",
    "culpabilidad penal": "Juicio de reproche al autor por haber actuado contrario a derecho pudiendo actuar conforme a él.",

    /* ── MATERIA CIVIL Y FAMILIAR ── */
    "divorcio": "Disolución del vínculo matrimonial por resolución judicial.",
    "divorcio incausado": "Divorcio que puede solicitarse sin expresar causa (reforma desde 2008 en México).",
    "alimentos": "Obligación legal de proporcionar lo necesario para subsistir: comida, vestido, habitación, educación y atención médica.",
    "pension alimenticia": "Cantidad fijada judicialmente que el deudor alimentario paga periódicamente.",
    "deudor alimentario": "Quien tiene la obligación legal de proporcionar alimentos.",
    "acreedor alimentario": "Quien tiene el derecho de recibir alimentos.",
    "guarda y custodia": "Atribución a uno o ambos progenitores del cuidado cotidiano de los hijos.",
    "custodia compartida": "Modalidad en que el cuidado de los hijos se ejerce de manera alternada por ambos progenitores.",
    "convivencias": "Régimen de visitas que permite al progenitor sin custodia relacionarse con sus hijos.",
    "adopcion": "Acto jurídico por el que se crea una relación análoga a la filiación entre adoptante y adoptado.",
    "concubinato": "Convivencia de pareja sin matrimonio con efectos jurídicos reconocidos.",
    "matrimonio": "Institución civil que une a dos personas mediante vínculo jurídico con derechos y obligaciones recíprocos.",
    "sociedad conyugal": "Régimen patrimonial en que los bienes adquiridos durante el matrimonio pertenecen a ambos cónyuges.",
    "separacion de bienes matrimonial": "Régimen en que cada cónyuge conserva la propiedad de sus propios bienes.",
    "albacea": "Persona designada para ejecutar la voluntad del testador y administrar la herencia.",
    "heredero": "Persona llamada a suceder al causante en la totalidad o parte de su patrimonio.",
    "sucesion intestamentaria": "Transmisión de bienes cuando el causante muere sin testamento válido.",
    "juicio sucesorio": "Proceso judicial para determinar herederos y adjudicar bienes de la herencia.",
    "particion de herencia": "División y adjudicación de los bienes de la herencia entre los herederos.",
    "interdiccion": "Resolución judicial que declara la incapacidad de una persona para administrar sus bienes.",

    /* ── AMPARO Y CONSTITUCIONAL ── */
    "amparo directo": "Juicio de amparo contra sentencias definitivas de tribunales; se promueve ante Tribunales Colegiados de Circuito.",
    "amparo indirecto": "Juicio de amparo contra actos de autoridad que no son sentencias definitivas; se promueve ante Juzgados de Distrito.",
    "conceptos de violacion": "Argumentos de la quejosa que expresan cómo el acto reclamado viola sus derechos constitucionales.",
    "acto reclamado": "Acto de autoridad que se impugna en el juicio de amparo.",
    "suspension del acto reclamado": "Medida cautelar en el amparo que paraliza la ejecución del acto impugnado.",
    "derechos humanos": "Derechos inherentes a toda persona reconocidos en la Constitución y tratados internacionales.",
    "control de convencionalidad": "Obligación de los jueces de aplicar tratados internacionales de derechos humanos.",
    "principio pro persona": "Obligación de aplicar la norma más favorable a la persona en materia de derechos humanos.",
    "suplencia de la queja": "Facultad del juez de amparo para subsanar defectos de la demanda en casos que la ley prevé.",
    "jurisprudencia obligatoria": "Criterio reiterado de la SCJN o Tribunales Colegiados vinculante para tribunales inferiores.",
    "tesis aislada": "Criterio judicial de un tribunal federal que no tiene el carácter de jurisprudencia obligatoria.",
    "controversia constitucional": "Conflicto entre poderes u órganos del Estado resuelto por la SCJN.",
    "accion de inconstitucionalidad": "Control abstracto de constitucionalidad ante la Suprema Corte de Justicia de la Nación.",

    /* ── MERCANTIL Y CONTRATOS ── */
    "titulo de credito": "Documento que incorpora un derecho literal y autónomo (pagaré, letra de cambio, cheque).",
    "letra de cambio": "Título de crédito que ordena al girado pagar una cantidad al beneficiario.",
    "cheque": "Título de crédito con que el librador ordena al banco el pago de una cantidad a favor del beneficiario.",
    "pagare": "Promesa incondicional de pagar una cantidad en fecha determinada regulada por la LGTOC.",
    "aval mercantil": "Garantía de pago de un título de crédito prestada por un tercero.",
    "accion cambiaria": "Acción para exigir el pago de un título de crédito.",
    "accion cambiaria directa": "Acción contra el principal obligado (suscriptor o aceptante).",
    "accion cambiaria de regreso": "Acción contra el endosante o avalista ante falta de pago.",
    "protesto notarial": "Diligencia notarial que acredita la falta de pago de un título de crédito.",
    "juicio ejecutivo mercantil": "Proceso para el cobro forzoso de títulos de crédito y documentos que traen aparejada ejecución.",
    "requerimiento de pago": "Actuación judicial por la que se exige el pago al deudor.",
    "embargo precautorio": "Embargo previo a la sentencia para asegurar bienes del deudor.",
    "clausula penal": "Estipulación que fija una sanción económica para quien incumpla el contrato.",
    "novacion": "Extinción de una obligación por la creación de una nueva que la sustituye.",
    "compensacion juridica": "Extinción de dos obligaciones recíprocas hasta el límite de la menor.",
    "concurso mercantil": "Proceso mediante el que una empresa insolvente busca reestructurar o liquidar sus obligaciones.",
    "sociedad anonima": "Sociedad mercantil con capital dividido en acciones y responsabilidad de socios limitada al monto de sus acciones.",
    "persona moral": "Ente colectivo con personalidad jurídica propia reconocida por la ley.",
    "acta constitutiva": "Instrumento notarial que da nacimiento a una persona moral.",
    "vicios redhibitorios": "Defectos ocultos que hacen inútil la cosa vendida y dan acción al comprador para rescindir.",
    "fideicomiso": "Acto jurídico por el que una persona destina bienes a un fin específico a través de un fiduciario.",
    "fideicomitente": "Persona que constituye un fideicomiso aportando bienes.",
    "fiduciario": "Institución que recibe y administra los bienes del fideicomiso.",
    "expropiacion": "Privación de la propiedad privada por causa de utilidad pública con indemnización.",
    "extincion de dominio": "Procedimiento por el que el Estado priva de bienes vinculados a actividades ilícitas sin indemnización.",

    /* ── TERMINOS PROCESALES FALTANTES ── */
    "recurso de revision": "Recurso ordinario ante tribunal superior para impugnar resoluciones de primera instancia.",
    "recurso de apelacion": "Recurso ordinario para impugnar sentencias de juzgados de primera instancia.",
    "aclaracion de sentencia": "Solicitud para que el juez corrija errores materiales o aclare puntos oscuros de su resolución.",
    "efectos suspensivos": "Efecto del recurso que detiene la ejecución de la sentencia hasta que el superior resuelva.",
    "caducidad de la instancia": "Extinción del proceso por inactividad de las partes durante cierto tiempo.",
    "cosa juzgada": "Efecto de la sentencia firme que impide un nuevo proceso sobre el mismo asunto.",
    "litispendencia": "Situación en que existe un juicio ya iniciado entre las mismas partes sobre el mismo objeto.",
    "principio de contradiccion": "Derecho de cada parte a conocer y rebatir lo alegado y probado por la contraria.",
    "principio de inmediacion": "Obligación del juez de estar presente en las audiencias y en contacto directo con las pruebas.",
    "prueba testimonial": "Declaración de testigos sobre los hechos controvertidos.",
    "prueba documental": "Documentos públicos o privados que sirven para acreditar hechos.",
    "prueba pericial": "Dictamen de un experto sobre cuestiones técnicas o científicas que el juez no puede apreciar por sí.",
    "prueba confesional": "Declaración de una parte sobre hechos propios que le son desfavorables.",
    "presuncion legal": "Consecuencia que la ley deduce de cierto hecho para tener por cierto otro.",
    "actuario judicial": "Funcionario que practica las notificaciones y diligencias ordenadas por el juez.",
    "radicacion": "Acto formal de admisión de un asunto por un juzgado o tribunal.",
    "acto de molestia": "Acto de autoridad que perturba derechos sin extinguirlos definitivamente.",
    "acto privativo": "Acto de autoridad que extingue de manera definitiva un derecho.",
    "inversion de la carga probatoria": "Casos en que la ley obliga a la parte contraria al actor a probar sus afirmaciones.",
    "carga de la prueba laboral": "En materia laboral el patrón tiene la obligación de probar condiciones de trabajo y causas de despido.",
    "exhibicion de documentos": "Obligación de presentar documentos en juicio a petición de la contraparte o del juez.",
    "contradiccion de tesis": "Procedimiento ante la SCJN para resolver criterios opuestos entre tribunales.",
    "ponente": "Magistrado o ministro encargado de formular el proyecto de resolución en un asunto colegiado.",
    "sala del tribunal": "División funcional de un tribunal que conoce asuntos por materia o cuantía.",
    "vicio de procedimiento": "Irregularidad en la tramitación del proceso que puede anular las actuaciones.",
    "nulidad de actuaciones": "Declaración de invalidez de actos procesales realizados sin cumplir requisitos legales.",
    "responsabilidad civil": "Obligación de reparar el daño causado por acto u omisión propia o de quien se responde.",
    "responsabilidad objetiva": "Responsabilidad que se genera por el solo uso de objetos peligrosos, sin importar culpa.",
    "daño moral": "Afectación a los sentimientos, afectos, creencias, decoro o vida privada de una persona.",
    "daño emergente": "Pérdida o menoscabo real sufrido en el patrimonio de una persona.",
    "lucro cesante": "Ganancia que una persona deja de percibir a causa de un hecho dañoso."
};



/* ================================================================
   DICCIONARIO & HERRAMIENTAS JURÍDICAS — diccionario_tools.js
   Jurídico Supra Legis
   ================================================================ */

/* ---- SINÓNIMOS JURÍDICOS ---- */
const SINONIMOS_JURIDICOS = {
    "demandar": ["interponer demanda", "ejercitar acción", "entablar juicio", "promover acción", "accionar", "litigar"],
    "acuerdo": ["convenio", "pacto", "contrato", "transacción", "estipulación", "concertación", "avenencia"],
    "incumplimiento": ["inobservancia", "contravención", "infracción", "violación", "quebrantamiento", "desacato"],
    "sentencia": ["fallo", "resolución definitiva", "veredicto", "pronunciamiento", "decreto judicial", "laudo"],
    "demandado": ["reo", "emplazado", "accionado", "querellado", "imputado", "encausado"],
    "demandante": ["actor", "accionante", "querellante", "promovente", "peticionario", "reclamante"],
    "abogado": ["licenciado en derecho", "defensor", "letrado", "asesor jurídico", "procurador", "jurista"],
    "contrato": ["convenio", "acuerdo", "pacto", "instrumento", "negocio jurídico", "estipulación"],
    "embargo": ["aseguramiento", "cautela", "retención judicial", "inmovilización de bienes", "afectación"],
    "rescisión": ["resolución", "nulidad", "anulación", "terminación", "extinción", "revocación"],
    "herencia": ["sucesión", "legado", "acervo hereditario", "masa hereditaria", "caudal relicto"],
    "juicio": ["proceso", "litigio", "pleito", "causa", "instancia", "procedimiento judicial"],
    "notificación": ["comunicación", "aviso judicial", "emplazamiento", "citatorio", "cédula"],
    "prueba": ["evidencia", "sustento probatorio", "medio de convicción", "constancia", "acreditación"],
    "recurso": ["impugnación", "medio de defensa", "remedio procesal", "apelación", "queja"],
    "obligación": ["compromisos", "deber jurídico", "prestación", "vínculo obligacional", "carga"],
    "pago": ["cumplimiento", "liquidación", "solución", "finiquito", "abono", "satisfacción"],
    "deuda": ["adeudo", "obligación dineraria", "crédito pasivo", "pasivo", "gravamen"],
    "acreedor": ["beneficiario", "titular del crédito", "tenedor", "tomador", "portador"],
    "deudor": ["obligado", "sujeto pasivo", "responsable", "avalado", "moroso"],
    "multa": ["sanción económica", "pena pecuniaria", "penalidad", "ameritamiento", "corrección"],
    "testigo": ["declarante", "deponente", "perito testifical", "informante"],
    "perito": ["experto", "especialista", "técnico", "auxiliar pericial", "dictaminador"],
    "apelación": ["alzada", "impugnación", "segunda instancia", "recurso ordinario"],
    "amparo": ["garantías constitucionales", "protección constitucional", "juicio de garantías"],
    "poder notarial": ["mandato", "representación legal", "procuración", "carta poder notarial"],
    "delito": ["ilícito penal", "infracción penal", "conducta típica", "crimen", "hecho punible"],
    "acusado": ["imputado", "procesado", "encausado", "inculpado", "indiciado", "enjuiciado"],
    "inocente": ["absuelto", "exonerado", "libre de cargo", "inculpable", "sin responsabilidad"],
    "culpable": ["responsable", "autor", "perpetrador", "condenado", "convicto"],
    "pena": ["sanción", "condena", "castigo", "correctivo", "penalidad"],
    "libertad": ["excarcelación", "liberación", "soltura", "puesta en libertad"],
    "detención": ["arresto", "aprehensión", "captura", "privación de libertad", "remisión"],
    "desahucio": ["lanzamiento", "desalojo", "recuperación posesoria"],
    "arrendamiento": ["locación", "alquiler", "renta", "cesión de uso"],
    "propiedad": ["dominio", "titularidad", "pertenencia", "posesión en concepto de dueño"],
    "despido": ["rescisión de contrato laboral", "liquidación", "terminación de la relación laboral"],
    "daño": ["perjuicio", "menoscabo", "detrimento", "lesión patrimonial", "agravio"],
    "custodia": ["guarda", "tutela", "cargo", "responsabilidad parental"],
    "divorcio": ["disolución del matrimonio", "separación legal", "ruptura conyugal"],
    "alimentos": ["pensión alimenticia", "manutención", "sostenimiento", "obligación alimentaria"],
    "herencia intestada": ["sucesión ab intestato", "sucesión legítima", "herencia sin testamento"],
    "acto jurídico": ["negocio jurídico", "hecho voluntario", "manifestación de voluntad"],
    "resolución": ["acuerdo", "determinación", "providencia", "auto", "decreto"],
    "juzgado": ["tribunal unipersonal", "órgano jurisdiccional", "instancia judicial"],
    "abogado defensor": ["defensor de oficio", "defensor particular", "defensor público", "representante legal"],
    "término": ["plazo", "periodo procesal", "vencimiento", "lapso", "tiempo legal"],
    "prescripción": ["caducidad de la acción", "extinción por tiempo", "vencimiento del plazo"],
    "convenio": ["acuerdo transaccional", "arreglo", "trato", "negociación", "entendimiento"],
    "gastos": ["costas", "erogaciones", "honorarios", "viáticos", "desembolsos"]
};

/* ---- FRASES DE REDACCIÓN JURÍDICA ---- */
const FRASES_JURIDICAS = [
    // INICIO
    { cat: "inicio", texto: "C._________, JUEZ _____ DE LO CIVIL DEL ESTADO DE PUEBLA. PRESENTE." },
    { cat: "inicio", texto: "Por medio del presente ocurso, comparece ante Su Señoría..." },
    { cat: "inicio", texto: "El que suscribe, LIC. ____________, en mi carácter de Apoderado Legal de la parte ______________..." },
    { cat: "inicio", texto: "Con el debido respeto que merece Su Señoría, comparezco para exponer lo siguiente:" },
    { cat: "inicio", texto: "Ante Usted con respeto comparece _____________, señalando como domicilio para oír y recibir notificaciones el ubicado en..." },
    { cat: "inicio", texto: "En la vía y forma que corresponda en derecho, con el debido respeto me presento a exponer:" },
    { cat: "inicio", texto: "Señalando domicilio para oír y recibir toda clase de notificaciones y documentos el ubicado en _____________, y autorizando ampliamente para recibirlas al LIC. ___________." },

    // HECHOS
    { cat: "hechos", texto: "HECHOS\nBajo protesta de decir verdad, manifiesto lo siguiente:" },
    { cat: "hechos", texto: "PRIMERO.- Con fecha ___ de ___ de ___, ocurrió lo siguiente:" },
    { cat: "hechos", texto: "SEGUNDO.- No obstante lo anterior, la parte demandada ha incumplido con su obligación de..." },
    { cat: "hechos", texto: "TERCERO.- A la fecha de presentación del presente escrito, persiste el incumplimiento antes señalado." },
    { cat: "hechos", texto: "Que es el caso que la parte actora y la parte demandada celebraron un contrato de _________, con fecha _____." },
    { cat: "hechos", texto: "En virtud de los hechos narrados, queda de manifiesto que..." },
    { cat: "hechos", texto: "Lo anterior se acredita con las documentales que se acompañan al presente como Anexos numerados del ____ al ____." },
    { cat: "hechos", texto: "De los hechos narrados se desprende con claridad la responsabilidad de la parte demandada." },
    { cat: "hechos", texto: "Que los hechos que aquí se narran son verídicos y constan en los documentos que en su oportunidad se acompañarán." },

    // DERECHO
    { cat: "derecho", texto: "FUNDAMENTOS DE DERECHO\nLa presente acción encuentra sustento legal en los siguientes preceptos:" },
    { cat: "derecho", texto: "Con fundamento en los artículos _____, _____ y _____ del Código Civil del Estado de Puebla." },
    { cat: "derecho", texto: "En términos de lo dispuesto por el artículo _____ del Código de Procedimientos Civiles." },
    { cat: "derecho", texto: "De conformidad con lo establecido en el artículo _____, que a la letra dispone:" },
    { cat: "derecho", texto: "Lo anterior encuentra respaldo en la Jurisprudencia de rubro: \"___________\"" },
    { cat: "derecho", texto: "Esta H. Autoridad es competente para conocer del presente asunto en términos de lo dispuesto por el artículo ___." },
    { cat: "derecho", texto: "La acción ejercitada se encuentra dentro del término legal previsto por el artículo ___, por lo que no ha operado la prescripción." },
    { cat: "derecho", texto: "Son aplicables al caso concreto las disposiciones contenidas en el Título ___, Capítulo ___ del ordenamiento legal en cita." },
    { cat: "derecho", texto: "Dicho precepto es del tenor literal siguiente: \"...\"" },
    { cat: "derecho", texto: "La Suprema Corte de Justicia de la Nación ha establecido que..." },

    // PETICIÓN
    { cat: "peticion", texto: "POR LO ANTERIORMENTE EXPUESTO Y FUNDADO, a Su Señoría atentamente solicito se sirva:" },
    { cat: "peticion", texto: "PRIMERO.- Tenerme por presentado en los términos del presente ocurso." },
    { cat: "peticion", texto: "SEGUNDO.- Admitir la demanda interpuesta y ordenar el emplazamiento de la parte demandada." },
    { cat: "peticion", texto: "TERCERO.- En su oportunidad, dictar sentencia definitiva condenando a la parte demandada al pago de..." },
    { cat: "peticion", texto: "Se solicita respetuosamente se decrete medida precautoria consistente en embargo de bienes de la parte demandada." },
    { cat: "peticion", texto: "Se solicita se admita la prueba documental consistente en..." },
    { cat: "peticion", texto: "Se solicita se libre exhorto al Juzgado competente del lugar donde se encuentran los bienes embargados." },
    { cat: "peticion", texto: "PETICIÓN CONCRETA: Se condene a la parte demandada al pago de la cantidad de $_______ (_______ PESOS __/100 M.N.), más los intereses moratorios generados." },
    { cat: "peticion", texto: "Asimismo, se condene al pago de gastos y costas del presente juicio." },
    { cat: "peticion", texto: "Se solicita la devolución de los documentos originales, une vez que hayan sido cotejados." },

    // CIERRE
    { cat: "cierre", texto: "PROTESTO LO NECESARIO.\n\n[Lugar y Fecha]\n\n_______________________\n[Nombre del Abogado]\nCédula Profesional No. _______" },
    { cat: "cierre", texto: "A T E N T A M E N T E\n[Lugar], a [Fecha]" },
    { cat: "cierre", texto: "Reitero a Usted las seguridades de mi atenta y distinguida consideración." },
    { cat: "cierre", texto: "Es cuanto respetuosamente solicito." },
    { cat: "cierre", texto: "Sin más por el momento, quedo en espera de sus finas atenciones." },
    { cat: "cierre", texto: "Por lo expuesto y fundado, sírvase Su Señoría proveer de conformidad, que en justicia procede." },
    { cat: "cierre", texto: "QUEDO EN ESPERA DE SUS FINAS ATENCIONES.\n\n_______________________\nLIC. [NOMBRE]\nCédula Profesional: [No.]" },
];

/* ---- NAVEGACIÓN POR PESTAÑAS ---- */
window.showDicTab = (tab) => {
    const tabs = ['definiciones', 'sinonimos', 'frases', 'corrector', 'lexico'];
    tabs.forEach(t => {
        const content = document.getElementById(`tab-content-${t}`);
        const btn = document.getElementById(`tab-${t.substring(0, 3)}`);
        if (content) content.style.display = (t === tab) ? '' : 'none';
        if (btn) {
            btn.classList.toggle('btn-primary', t === tab);
            btn.classList.toggle('btn-outline', t !== tab);
        }
    });
    if (tab === 'frases') filtrarFrases('todas');
    if (tab === 'lexico') renderLexicoCorrector('');
};

/* ---- BUSCADOR DE SINÓNIMOS ---- */
window.buscarSinonimos = () => {
    const query = document.getElementById('searchSinonimos').value.toLowerCase().trim();
    const container = document.getElementById('sinonimoResult');
    if (!container) return;

    if (!query) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round" style="font-size:3rem;color:#C9A227">swap_horiz</span>
                <p>Escribe un término para encontrar sus sinónimos jurídicos.</p>
            </div>`;
        return;
    }

    // Buscar coincidencias exactas y parciales
    const exactos = [];
    const parciales = [];

    Object.keys(SINONIMOS_JURIDICOS).forEach(key => {
        if (key === query) {
            exactos.push({ key, syns: SINONIMOS_JURIDICOS[key] });
        } else if (key.includes(query) || SINONIMOS_JURIDICOS[key].some(s => s.toLowerCase().includes(query))) {
            parciales.push({ key, syns: SINONIMOS_JURIDICOS[key] });
        }
    });

    const resultados = [...exactos, ...parciales];

    if (resultados.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round" style="font-size:3rem;color:#ddd">search_off</span>
                <p>No se encontraron sinónimos para "<strong>${query}</strong>".</p>
            </div>`;
        return;
    }

    container.innerHTML = resultados.map(r => `
        <div class="diccionario-item" style="margin-bottom:12px;">
            <h4 style="text-transform:capitalize;margin-bottom:10px;">${r.key}</h4>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${r.syns.map(s => `
                    <span onclick="copiarTexto('${s}')" title="Clic para copiar"
                        style="background:var(--accent-light);color:var(--primary);padding:5px 12px;
                               border-radius:20px;font-size:0.85rem;cursor:pointer;border:1px solid rgba(201,162,39,0.3);
                               transition:all 0.2s;" 
                        onmouseover="this.style.background='var(--accent)';this.style.color='white'"
                        onmouseout="this.style.background='var(--accent-light)';this.style.color='var(--primary)'">
                        ${s}
                    </span>`).join('')}
            </div>
        </div>
    `).join('');
};

/* ---- FRASES DE REDACCIÓN ---- */
window.filtrarFrases = (categoria) => {
    const container = document.getElementById('frasesResult');
    if (!container) return;

    const lista = categoria === 'todas'
        ? FRASES_JURIDICAS
        : FRASES_JURIDICAS.filter(f => f.cat === categoria);

    const iconos = { inicio: '📄', hechos: '📋', derecho: '⚖️', peticion: '✋', cierre: '✍️' };

    container.innerHTML = lista.map(f => `
        <div onclick="copiarTexto(\`${f.texto.replace(/`/g, '\\`')}\`)"
            title="Clic para copiar"
            style="background:white;border:1px solid var(--border-color);border-left:4px solid var(--accent);
                   padding:14px;border-radius:8px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;
                   white-space:pre-line;line-height:1.5;color:var(--text-main);"
            onmouseover="this.style.boxShadow='var(--shadow-gold)';this.style.borderLeftColor='var(--primary)'"
            onmouseout="this.style.boxShadow='none';this.style.borderLeftColor='var(--accent)'">
            <div style="font-size:0.75rem;color:var(--accent);font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">
                ${iconos[f.cat] || '📌'} ${f.cat}
                <span style="float:right;color:#aaa;">📋 Copiar</span>
            </div>
            ${f.texto}
        </div>
    `).join('');
};

/* ---- COPIAR AL PORTAPAPELES ---- */
window.copiarTexto = async (texto) => {
    try {
        await navigator.clipboard.writeText(texto);
        // Toast notification
        showToast('✅ Copiado al portapapeles');
    } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✅ Copiado al portapapeles');
    }
};

function showToast(msg) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = `
            position:fixed;bottom:30px;right:30px;
            background:#1a1a1a;color:#C9A227;
            padding:12px 22px;border-radius:8px;
            font-weight:600;font-size:0.9rem;
            box-shadow:0 4px 20px rgba(0,0,0,0.3);
            z-index:9999;transition:opacity 0.4s;
            border-left:4px solid #C9A227;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

/* ---- CONTADOR CORRECTOR ---- */
window.actualizarContadorCorrector = () => {
    const text = document.getElementById('correctorText')?.value || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const stats = document.getElementById('correctorStats');
    if (stats) stats.textContent = `${words} palabras | ${chars} caracteres`;
};

/* ================================================================
   GUÍA DE LÉXICO CORRECTO
   Uso correcto vs incorrecto de términos jurídicos
   ================================================================ */
const LEXICO_CORRECTO = [
    {
        cat: "escritos",
        termino: "DEMANDA vs DENUNCIA vs QUERELLA",
        correcto: "DEMANDA",
        uso: "En materia civil, mercantil o familiar. El particular exige al juez que condene al demandado a cumplir una obligación.",
        ejemplo: "Se interpone DEMANDA en juicio ejecutivo mercantil.",
        incorrecto: "DENUNCIA (en materia civil)",
        nota: "La DENUNCIA es exclusiva de materia penal: pone en conocimiento del MP un hecho posiblemente delictivo. La QUERELLA también es penal pero solo puede presentarla el ofendido directo."
    },
    {
        cat: "verbos",
        termino: "INTERPONER vs PROMOVER vs PRESENTAR",
        correcto: "INTERPONER",
        uso: "Para recursos (apelación, amparo, queja) y para acciones formales en juicio.",
        ejemplo: "Se INTERPONE recurso de apelación. Se INTERPONE demanda.",
        incorrecto: "PRESENTAR (demanda)",
        nota: "PROMOVER se usa para cualquier gestión o escrito ante el juzgado. PRESENTAR es coloquial y técnicamente impreciso para demandas y recursos. INTERPONER es el término técnico correcto."
    },
    {
        cat: "verbos",
        termino: "SOLICITAR vs PEDIR vs REQUERIR",
        correcto: "SOLICITAR",
        uso: "Para todo escrito dirigido al juez donde se pide una actuación.",
        ejemplo: "Se SOLICITA se decreten medidas cautelares.",
        incorrecto: "PEDIR (en escritos formales)",
        nota: "PEDIR es coloquial. REQUERIR implica una orden con autoridad (el juez requiere; el abogado solicita). En escritos procesales use siempre SOLICITAR."
    },
    {
        cat: "partes",
        termino: "ACTOR vs DEMANDANTE vs ACCIONANTE",
        correcto: "ACTOR / PARTE ACTORA",
        uso: "En materia civil y familiar. Quien inicia el juicio ejerciendo la acción.",
        ejemplo: "La parte ACTORA solicita lo siguiente...",
        incorrecto: "QUEJOSO (en materia civil ordinaria)",
        nota: "QUEJOSO es exclusivo del juicio de AMPARO. DEMANDANTE y ACCIONANTE son equivalentes válidos. En el escrito se prefiere 'parte actora' para evitar repeticiones del nombre."
    },
    {
        cat: "partes",
        termino: "DEMANDADO vs REO vs IMPUTADO",
        correcto: "DEMANDADO / PARTE DEMANDADA",
        uso: "En materia civil y mercantil. Quien es llamado a juicio.",
        ejemplo: "La parte DEMANDADA no compareció al procedimiento.",
        incorrecto: "REO (en lo civil) / IMPUTADO (en lo civil)",
        nota: "REO es arcaico pero válido en doctrina civil. IMPUTADO es exclusivamente penal (CPP). En materia laboral se dice 'parte demandada' o 'patrón'."
    },
    {
        cat: "partes",
        termino: "QUEJOSO vs RECURRENTE vs APELANTE",
        correcto: "QUEJOSO",
        uso: "Exclusivamente en el juicio de AMPARO. Quien promueve el amparo contra un acto de autoridad.",
        ejemplo: "El QUEJOSO señala como acto reclamado la sentencia de fecha...",
        incorrecto: "DEMANDANTE (en amparo)",
        nota: "En apelación se dice APELANTE. En casación, RECURRENTE. En amparo siempre QUEJOSO. No se intercambian."
    },
    {
        cat: "resoluciones",
        termino: "SENTENCIA vs AUTO vs ACUERDO vs RESOLUCIÓN",
        correcto: "SENTENCIA",
        uso: "Resolución que pone fin al juicio en lo principal. Decide el fondo del asunto.",
        ejemplo: "El juez dictó SENTENCIA definitiva condenando a...",
        incorrecto: "AUTO (para resolver el fondo)",
        nota: "AUTO resuelve cuestiones procesales secundarias (admitir pruebas, dar traslado). ACUERDO es sinónimo de auto en muchos juzgados. RESOLUCIÓN es el término genérico que engloba a todos. Solo la SENTENCIA resuelve el fondo."
    },
    {
        cat: "resoluciones",
        termino: "EJECUTORIA vs COSA JUZGADA vs FIRME",
        correcto: "SENTENCIA EJECUTORIADA",
        uso: "Sentencia que ya no admite ningún recurso ordinario y es definitivamente obligatoria.",
        ejemplo: "La sentencia ha causado EJECUTORIA y procede su ejecución.",
        incorrecto: "SENTENCIA FIRME (uso anglicado)",
        nota: "'Firme' se usa en España. En México lo correcto es EJECUTORIA o 'ha causado ejecutoria'. La COSA JUZGADA es el efecto de la ejecutoria: nadie puede volver a litigar lo mismo."
    },
    {
        cat: "acciones",
        termino: "ACCIÓN vs PRETENSIÓN vs DERECHO",
        correcto: "ACCIÓN",
        uso: "Facultad de acudir al juez para pedir tutela jurídica. Se EJERCITA una acción.",
        ejemplo: "La parte actora EJERCITA acción de cumplimiento de contrato.",
        incorrecto: "EJERCER (la acción)",
        nota: "Lo técnico es EJERCITAR la acción, no 'ejercer'. La PRETENSIÓN es lo concreto que se pide en esa acción. El DERECHO es lo que se busca proteger."
    },
    {
        cat: "acciones",
        termino: "RECURSO vs MEDIO DE IMPUGNACIÓN vs REMEDIO PROCESAL",
        correcto: "RECURSO",
        uso: "Medio para combatir resoluciones judiciales ante el mismo o superior órgano.",
        ejemplo: "Se INTERPONE recurso de apelación en contra del auto de fecha...",
        incorrecto: "APELACIÓN (como sinónimo genérico de recurso)",
        nota: "La APELACIÓN es un recurso específico. MEDIO DE IMPUGNACIÓN es el género (incluye recursos, juicio de amparo, etc.). No todo medio de impugnación es un recurso."
    },
    {
        cat: "plazos",
        termino: "TÉRMINO vs PLAZO",
        correcto: "TÉRMINO",
        uso: "En derecho procesal mexicano: tiempo fijado para realizar un acto procesal.",
        ejemplo: "Dentro del TÉRMINO de tres días hábiles...",
        incorrecto: "'TERMINO' sin acento ortográfico",
        nota: "TÉRMINO (con acento) = plazo procesal. TERMINO (sin acento, primera persona) = 'yo termino'. Son palabras distintas. En documentos jurídicos siempre con acento: TÉRMINO. PLAZO es equivalente válido."
    },
    {
        cat: "plazos",
        termino: "PRESCRIPCIÓN vs CADUCIDAD",
        correcto: "Depende del efecto:",
        uso: "PRESCRIPCIÓN extingue la acción por inactividad del titular. CADUCIDAD extingue el derecho mismo de pleno derecho por el paso del tiempo.",
        ejemplo: "La acción para reclamar daños PRESCRIBE en 2 años. El plazo para apelar CADUCA si no se interpone en tiempo.",
        incorrecto: "Usarlos como sinónimos",
        nota: "La PRESCRIPCIÓN puede interrumpirse; la CADUCIDAD no. La prescripción opera por excepción; la caducidad, de oficio. Son instituciones distintas."
    },
    {
        cat: "verbos",
        termino: "DICTAR vs EMITIR vs PRONUNCIAR (sentencia)",
        correcto: "DICTAR",
        uso: "El juez DICTA sentencias, autos y acuerdos.",
        ejemplo: "El Juez DICTÓ sentencia definitiva el día...",
        incorrecto: "EMITIR sentencia (impropio)",
        nota: "EMITIR se usa para opiniones, dictámenes y votos. PRONUNCIAR es válido en contextos formales ('pronunciar fallo'). En México lo más técnico y común es DICTAR."
    },
    {
        cat: "verbos",
        termino: "NOTIFICAR vs CITAR vs EMPLAZAR",
        correcto: "Depende del acto:",
        uso: "NOTIFICAR: comunicar una resolución ya dictada. CITAR: llamar a comparecer en fecha/hora. EMPLAZAR: llamar al demandado por primera vez al juicio (fija su término para contestar).",
        ejemplo: "Se EMPLAZÓ al demandado el día 5. Se NOTIFICÓ el auto al actor. Se CITÓ a las partes a la audiencia.",
        incorrecto: "Usar NOTIFICAR para el emplazamiento inicial",
        nota: "El EMPLAZAMIENTO es la notificación más importante del proceso porque da oportunidad al demandado de defenderse. Técnicamente no es una simple notificación."
    },
    {
        cat: "contratos",
        termino: "RESCISIÓN vs RESOLUCIÓN vs NULIDAD vs ANULABILIDAD",
        correcto: "Depende del vicio:",
        uso: "RESCISIÓN: terminar el contrato por incumplimiento (sí fue válido). NULIDAD: el contrato nunca existió (vicio desde el origen). ANULABILIDAD: puede anularse pero es válido hasta que se declare.",
        ejemplo: "Se demanda RESCISIÓN de contrato por mora en pagos. Se demanda NULIDAD por objeto ilícito.",
        incorrecto: "Usar NULIDAD para incumplimiento",
        nota: "La RESOLUCIÓN (civil) extingue el contrato bilateral por incumplimiento con efectos retroactivos. La RESCISIÓN tiene efectos hacia el futuro. En México el CPC usa rescisión para ambas."
    },
    {
        cat: "partes",
        termino: "TERCERO vs TERCERO PERJUDICADO vs TERCERO INTERESADO",
        correcto: "Depende del contexto:",
        uso: "TERCERO: quien no es parte en el juicio. TERCERO PERJUDICADO: en amparo, quien tiene interés contrario al quejoso. TERCERO INTERESADO: en nulidades o procedimientos especiales.",
        ejemplo: "Se llama como TERCERO PERJUDICADO a quien obtuvo la sentencia reclamada en amparo.",
        incorrecto: "Tercero perjudicado en juicio civil ordinario",
        nota: "En el juicio civil ordinario no existe la figura del 'tercero perjudicado'. Sí existe el TERCERISTA (quien interpone tercería excluyente de dominio o de preferencia)."
    },
    {
        cat: "escritos",
        termino: "OCURSO vs ESCRITO vs PROMOCIÓN vs LIBELO",
        correcto: "ESCRITO / PROMOCIÓN",
        uso: "Documento que cualquier parte presenta ante el juzgado durante el proceso.",
        ejemplo: "Por medio del presente ESCRITO, la parte actora solicita...",
        incorrecto: "LIBELO (connotación despectiva)",
        nota: "OCURSO es sinónimo formal y válido de escrito o promoción. LIBELO históricamente tiene connotación de escrito difamatorio. En práctica, ocurso y promoción son los más usados en México."
    },
    {
        cat: "escritos",
        termino: "CONTESTACIÓN vs RESPUESTA vs OPOSICIÓN",
        correcto: "CONTESTACIÓN DE DEMANDA",
        uso: "El acto procesal por el cual el demandado responde a la demanda dentro del término de emplazamiento.",
        ejemplo: "La parte demandada presenta su CONTESTACIÓN DE DEMANDA en tiempo y forma.",
        incorrecto: "RESPUESTA a la demanda",
        nota: "RESPUESTA no es un término técnico procesal. La RECONVENCIÓN es la contrademanda que el demandado puede interponer simultáneamente con la contestación."
    },
    {
        cat: "acciones",
        termino: "GARANTÍAS vs DERECHOS HUMANOS vs DERECHOS FUNDAMENTALES",
        correcto: "DERECHOS HUMANOS / DERECHOS FUNDAMENTALES",
        uso: "Tras la reforma constitucional de 2011, lo correcto es 'derechos humanos' y sus garantías para su protección.",
        ejemplo: "Se violan los DERECHOS HUMANOS del quejoso reconocidos en la Constitución y tratados internacionales.",
        incorrecto: "GARANTÍAS INDIVIDUALES (término anterior a 2011)",
        nota: "Antes de 2011, el Título Primero de la Constitución se llamaba 'Garantías Individuales'. Hoy se llama 'Derechos Humanos y sus Garantías'. En amparos recientes se debe usar la terminología actual."
    },
    {
        cat: "plazos",
        termino: "DÍAS HÁBILES vs DÍAS NATURALES vs DÍAS DE DESPACHO",
        correcto: "Verificar el ordenamiento aplicable",
        uso: "DÍAS HÁBILES: excluye sábados, domingos y festivos. DÍAS NATURALES: todos los días del calendario. DÍAS DE DESPACHO: los días que el juzgado abre.",
        ejemplo: "El término para apelar es de 9 DÍAS HÁBILES contados a partir del siguiente al de la notificación.",
        incorrecto: "Asumir que todos los plazos son hábiles",
        nota: "Siempre revisar si el código aplicable dice 'días hábiles', 'naturales' o 'de despacho'. En CPC de Puebla la mayoría son días hábiles. El amparo tiene términos propios."
    },
];

/* ---- RENDER LÉXICO CORRECTO ---- */
window.renderLexicoCorrector = (filtro = '') => {
    const container = document.getElementById('lexicoResult');
    if (!container) return;

    const catActiva = document.getElementById('lexicoFiltroActivo')?.dataset?.cat || 'todas';

    let lista = LEXICO_CORRECTO;
    if (catActiva !== 'todas') lista = lista.filter(l => l.cat === catActiva);
    if (filtro) {
        const q = filtro.toLowerCase();
        lista = lista.filter(l =>
            l.termino.toLowerCase().includes(q) ||
            l.correcto.toLowerCase().includes(q) ||
            l.uso.toLowerCase().includes(q) ||
            l.nota.toLowerCase().includes(q)
        );
    }

    if (lista.length === 0) {
        container.innerHTML = `<div class="empty-state"><span class="material-icons-round" style="font-size:3rem;color:#ddd">search_off</span><p>No se encontraron términos.</p></div>`;
        return;
    }

    const iconoCat = { escritos: '📄', verbos: '🔤', partes: '👥', resoluciones: '⚖️', acciones: '⚡', plazos: '⏱️', contratos: '📑' };

    container.innerHTML = lista.map(l => `
        <div style="background:white;border:1px solid var(--border-color);border-radius:10px;
                    padding:0;overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:14px;">
            <!-- Cabecera -->
            <div style="background:linear-gradient(90deg,#1a1a1a,#2d2d2d);padding:12px 18px;display:flex;justify-content:space-between;align-items:center;">
                <strong style="color:#C9A227;font-size:0.95rem;">${iconoCat[l.cat] || '📌'} ${l.termino}</strong>
                <span style="background:rgba(201,162,39,0.2);color:#C9A227;padding:3px 10px;border-radius:20px;font-size:0.75rem;text-transform:uppercase;">${l.cat}</span>
            </div>
            <!-- Cuerpo -->
            <div style="padding:16px 18px;display:grid;gap:10px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <!-- Correcto -->
                    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px 14px;border-radius:6px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#16a34a;text-transform:uppercase;margin-bottom:4px;">✅ USO CORRECTO</div>
                        <div style="font-weight:700;color:#166534;font-size:0.95rem;">${l.correcto}</div>
                    </div>
                    <!-- Incorrecto -->
                    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:10px 14px;border-radius:6px;">
                        <div style="font-size:0.72rem;font-weight:700;color:#dc2626;text-transform:uppercase;margin-bottom:4px;">❌ EVITAR</div>
                        <div style="font-weight:600;color:#991b1b;font-size:0.9rem;">${l.incorrecto}</div>
                    </div>
                </div>
                <!-- Uso -->
                <div style="background:#fffbeb;border-left:4px solid #C9A227;padding:10px 14px;border-radius:6px;">
                    <div style="font-size:0.72rem;font-weight:700;color:#8B6914;text-transform:uppercase;margin-bottom:4px;">📋 CUÁNDO USARLO</div>
                    <div style="font-size:0.88rem;color:#78350f;">${l.uso}</div>
                    <div style="margin-top:6px;font-style:italic;font-size:0.85rem;color:#92400e;border-top:1px solid rgba(201,162,39,0.3);padding-top:6px;">
                        Ej: <em>${l.ejemplo}</em>
                        <button onclick="copiarTexto('${l.ejemplo.replace(/'/g, "\\'")}')"
                            style="margin-left:8px;background:none;border:1px solid #C9A227;color:#8B6914;
                                   border-radius:4px;padding:1px 8px;font-size:0.75rem;cursor:pointer;">📋</button>
                    </div>
                </div>
                <!-- Nota técnica -->
                <div style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;padding:0 2px;">
                    <strong style="color:var(--text-main);">Nota técnica:</strong> ${l.nota}
                </div>
            </div>
        </div>
    `).join('');
};

window.filtrarLexicoCat = (cat, btn) => {
    // Actualizar botones
    document.querySelectorAll('.lexico-cat-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
    });
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-outline');
    // Guardar estado
    const indicator = document.getElementById('lexicoFiltroActivo');
    if (indicator) indicator.dataset.cat = cat;
    const q = document.getElementById('searchLexico')?.value || '';
    renderLexicoCorrector(q);
};

/* ================================================================
   FUNCIONES PRINCIPALES DEL DICCIONARIO
   ================================================================ */

/* Normalizador de cadena: quita acentos y convierte a minusculas */
function _normStr(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/* Busqueda en el diccionario de definiciones */
window.filtrarDiccionario = () => {
    const rawQuery = document.getElementById('searchDiccionario').value.trim();
    const query = _normStr(rawQuery);
    const container = document.getElementById('diccionarioResult');
    if (!container) return;
    container.innerHTML = '';

    if (!query) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round" style="font-size:3.5rem;color:#C9A227">menu_book</span>
                <p>Escribe un termino para buscar su definicion legal.<br>
                <small style="color:#aaa">750+ terminos disponibles</small></p>
            </div>`;
        return;
    }

    const matches = Object.entries(DICCIONARIO_JURIDICO)
        .filter(([k, v]) => _normStr(k).includes(query) || _normStr(v).includes(query))
        .sort((a, b) => {
            // Primero coincidencias exactas al inicio del termino
            const aStart = _normStr(a[0]).startsWith(query) ? 0 : 1;
            const bStart = _normStr(b[0]).startsWith(query) ? 0 : 1;
            return aStart - bStart || a[0].localeCompare(b[0], 'es');
        });

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round" style="font-size:3rem;color:#ddd">search_off</span>
                <p>No se encontro el termino "<strong>${query}</strong>".<br>
                <button class="btn btn-outline" style="margin-top:10px;font-size:0.85rem;"
                    onclick="buscarEnRAE()">Buscar en diccionario RAE</button></p>
            </div>`;
        return;
    }

    // Badge con conteo
    container.innerHTML = `<p style="font-size:0.8rem;color:#888;margin:0 0 12px 0;font-style:italic;">
        ${matches.length} resultado(s) para "<strong>${query}</strong>"</p>`;

    matches.forEach(([key, def]) => {
        const item = document.createElement('div');
        item.className = 'diccionario-item';
        // Resaltar la busqueda (sin tilde, sobre clave original)
        const highlighted = key.replace(
            new RegExp(_normStr(query).split('').map(c => '[' + c + _normStr(c) + ']').join(''), 'gi'),
            m => `<mark style="background:#fff3cd;border-radius:3px;">${m}</mark>`
        ) || key;
        item.innerHTML = `
            <h4 style="display:flex;justify-content:space-between;align-items:start;">
                <span>${highlighted}</span>
                <button onclick="copiarTexto('${key}: ${def.replace(/'/g, "\\'")}') "
                    title="Copiar definicion"
                    style="background:none;border:1px solid rgba(201,162,39,0.4);color:#C9A227;
                           border-radius:5px;padding:2px 8px;font-size:0.75rem;cursor:pointer;flex-shrink:0;margin-left:8px;">
                    Copiar
                </button>
            </h4>
            <p style="margin:0;line-height:1.6;">${def}</p>`;
        container.appendChild(item);
    });
};

/* Buscar en la RAE */
window.buscarEnRAE = () => {
    const query = document.getElementById('searchDiccionario')?.value.trim() || '';
    if (query) {
        window.open(`https://dpej.rae.es/lema/${encodeURIComponent(query)}`, '_blank');
    } else {
        window.open('https://dpej.rae.es/', '_blank');
    }
};

/* Corrector: limpiar */
window.limpiarCorrector = () => {
    const ta = document.getElementById('correctorText');
    const res = document.getElementById('correctorResults');
    const st = document.getElementById('correctorStats');
    if (ta) ta.value = '';
    if (res) res.style.display = 'none';
    if (st) st.textContent = '0 palabras | 0 caracteres';
};

/* Distancia Levenshtein */
function levenshteinDistance(a, b) {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b[i - 1] === a[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
    }
    return matrix[b.length][a.length];
}

/* Corrector: verificar texto */
window.verificarTexto = () => {
    const text = document.getElementById('correctorText')?.value || '';
    const resultArea = document.getElementById('correctorResults');
    const sugerenciasList = document.getElementById('sugerenciasList');
    const stats = document.getElementById('correctorStats');

    if (!text.trim()) { alert('Por favor, ingresa un texto para verificar.'); return; }

    const words = text.split(/[\s,.;:!?()"]+/).filter(w => w.length > 3);
    const unique = [...new Set(words)];
    const errors = [];
    const terms = Object.keys(DICCIONARIO_JURIDICO);

    unique.forEach(word => {
        const clean = word.toLowerCase().trim();
        for (const term of terms) {
            if (levenshteinDistance(clean, term) === 1 && clean !== term) {
                errors.push({ original: word, suggestion: term });
                break;
            }
        }
    });

    if (stats) stats.textContent = `${words.length} palabras | ${errors.length} sugerencias legales`;

    if (errors.length > 0) {
        if (resultArea) resultArea.style.display = 'block';
        if (sugerenciasList) {
            sugerenciasList.innerHTML = '';
            errors.forEach(err => {
                const div = document.createElement('div');
                div.style.cssText = 'padding:8px;border-bottom:1px solid #eee;font-size:0.9rem;';
                div.innerHTML = `Quizas quiso escribir <strong style="color:var(--primary);cursor:pointer"
                    onclick="reemplazarPalabraCorrector('${err.original}','${err.suggestion}')">${err.suggestion}</strong> 
                    en lugar de "<em>${err.original}</em>"`;
                sugerenciasList.appendChild(div);
            });
        }
    } else {
        if (resultArea) resultArea.style.display = 'none';
        alert('No se detectaron errores en terminos juridicos.\n\nEl navegador tambien subraya errores generales en rojo.');
    }
};

window.reemplazarPalabraCorrector = (oldW, newW) => {
    const area = document.getElementById('correctorText');
    if (area) area.value = area.value.replace(new RegExp(oldW, 'g'), newW);
    verificarTexto();
};
