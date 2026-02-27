templateText = `CONTRATO PRIVADO DE ARRENDAMIENTO

LUGAR Y FECHA: Puebla, Puebla, a ${fechaHoy}.

REUNIDOS:
De una parte, como ARRENDADOR: __________________________ (Propietario)
De otra parte, como ARRENDATARIO: ${r.nombre.toUpperCase()}.
(Si aplica) Como FIADOR: __________________________

AMBAS PARTES, reconociéndose mutua capacidad legal para contratar y obligarse, celebran el presente CONTRATO PRIVADO, al tenor de las siguientes:

CLÁUSULAS:

PRIMERA (OBJETO): El Arrendador da en arrendamiento al Arrendatario la casa habitación ubicada en: ${r.domicilio}, la cual se encuentra en buen estado.

SEGUNDA (RENTA): La renta mensual será de $__________ (__________________________ PESOS M.N.), pagadera por adelantado los días ___ de cada mes.

TERCERA (VIGENCIA): La duración de este contrato será de UN AÑO FORZOSO, iniciando el día ________________ y concluyendo el día ________________.

CUARTA (USO DESTINO): El inmueble se usará  EXCLUSIVAMENTE PARA CASA HABITACIÓN.

QUINTA (DEPÓSITO): Se entrega en este acto la cantidad de $__________ como depósito en garantía.

SEXTA (SERVICIOS): El pago de servicios (luz, agua, gas) corre por cuenta exclusiva del Arrendatario.

LEÍDO QUE FUE, LO FIRMAN DE CONFORMIDAD:

ARRENDADOR                          ARRENDATARIO
_______________________             _______________________
                                    ${r.nombre.toUpperCase()}

FIADOR (Opcional)
_______________________`;
