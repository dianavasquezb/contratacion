"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import logoAlcaldia from "../assets/logoalcaldia.png"
import "../styles/Formulario.css" // Importar los estilos originales

export default function ContractForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState("solicitante")

  // Texto estándar para el objeto contractual
  const textoObjetoContractual =
    'Apoyo a la gestión del Departamento Administrativo de Planeación, mediante el proceso de manejo y gestión de documentos, por medio de la organización, clasificación y digitalización del archivo de la unidad, análisis e interpretación de datos. Además, se brindará apoyo continuo al Departamento en la resolución de trámites y solicitudes asignadas por el director, en cumplimiento al Plan de Acción 2024 y el Plan de Desarrollo 2024-2027 "Somos Un Nuevo Aire"'

  // Opciones para los desplegables de Plan de Desarrollo Municipal
  const opcionesProgramas = [
    { value: "", label: "Seleccionar..." },
    {
      value: "1.1.1",
      label:
        "1.1.1 Fortalecimiento de los servicios de salud hacia la descentralizacion, la ampliacion de la cobertura. ",
    },
    { value: "1.1.2", label: "1.1.2 Vida Saludable en Copacabana. " },
    { value: "1.1.3", label: "1.1.3 Infraestructura innovadora y con calidad. " },
    { value: "1.1.4", label: "1.1.4  Fortalecimiento de los niveles de gobernanza de la salud.  " },
    { value: "1.2.1", label: "1.2.1 Fortalecimiento integral, pedagógico y educativo. " },
    { value: "1.2.2", label: "1.2.2 Acceso y permanencia en sistema educativo desde un enfoque territorial. " },
    {
      value: "1.2.3",
      label:
        "1.2.3 Desarrollo de un ecosistema  educativo 4.0 que apunte al fortalecimiento y encadenamineto de los diferentes niveles educativos. ",
    },
    { value: "1.3.1", label: "1.3.1 La cultura como vocación para el desarrollo en Copacabana. " },
    { value: "1.3.2", label: "1.3.2 Gestión, protección y salvaguardia del patrimonio cultural. " },
    { value: "1.3.3", label: "1.3.3 Mejoramiento y dotación de la infraestructura cultural.  " },
    { value: "1.3.4", label: "1.3.4 Gobernaza para la inclusión cultural. " },
    {
      value: "1.4.1",
      label:
        "1.4.1 Fortalecimiento de la cultura deportiva para el fomento a la recreación, la actividad física y el deporte. ",
    },
    {
      value: "1.4.2",
      label:
        "1.4.2 Fortalecimiento de la práctica deportiva, la infraestructura, la formación y preparación de deportistas aficionados y de alto rendimiento. ",
    },
    { value: "1.4.3", label: "1.4.3 Liderazgo en gobernanza para la gestión deportiva. " },
    {
      value: "2.1.1",
      label:
        "2.1.1 Protección, conservación y restauración de los sistemas naturales a través del SILAP y sus servicios ecosistemicos. ",
    },
    { value: "2.1.2", label: "2.1.2 Gestión Sostenible del Agua. " },
    { value: "2.1.3", label: "2.1.3 Adaptación al cambio climático. " },
    { value: "2.1.4", label: "2.1.4 Educación y cultura ambiental territorializada. " },
    { value: "2.1.5", label: "2.1.5 Gestión de residuos y fortalecimiento ambiental. " },
    { value: "2.1.6", label: "2.1.6 Producción verde y responsable. " },
    { value: "2.2.1", label: "2.2.1 Bienestar animal y tenencia responsable. " },
    { value: "2.3.1", label: "2.3.1 Hacia un gestión del riesgo integral. " },
    { value: "2.3.2", label: "2.3.2 Planificación e implementación técnica y normativa para el control del riesgo. " },
    {
      value: "2.3.3",
      label:
        "2.3.3 Capacidades técnicas y tecnológica para las medidas de prevención y mitigación de la gestión del riesgo. ",
    },
    { value: "2.4.1", label: "2.4.1 Vivienda digna para sus habitantes y servicios públicos. " },
    {
      value: "2.5.1",
      label: "2.5.1 Fortalecimiento de la Movilidad en Copacabana sostenible y con enfoque diferencial. ",
    },
    { value: "2.5.2", label: "2.5.2 Mejora de la Infraestructura Vial. " },
    { value: "2.5.3", label: "2.5.3 Movilidad innovadora e  inteligente. " },
    { value: "2.6.1", label: "2.6.1 Actualización del Plan Básico de Ordenamineto Territorial. " },
    { value: "2.6.2", label: "2.6.2 Ordenamiento territorial, infraestructura y desarrollo urbano. " },
    { value: "3.1.1", label: "3.1.1 Hacia una cultura del emprendimiento y el desarrollo empresarial. " },
    {
      value: "3.1.2",
      label: "3.1.2 Emprendimiento como alternativa para la generación y formalización para  empleo. ",
    },
    { value: "3.1.3", label: "3.1.3 Fortalecimiento empresarial desde un enfoque de  valor agregado. " },
    {
      value: "3.1.4",
      label: "3.1.4 Fortalecimiento del ecosistema empresarial y de innovación con enfoque metropolitano. ",
    },
    { value: "3.1.5", label: "3.1.5 Promoción del empleo y el trabajo. " },
    { value: "3.2.1", label: "3.2.1 Desarrollo agropecuario sostenible. " },
    { value: "3.2.2", label: "3.2.2 Desarrollo de cadenas de valor y promoción de productos locales. " },
    { value: "3.3.1", label: "3.3.1 Actualización del Plan de Desarrollo Turístico sostenible. " },
    {
      value: "3.3.2",
      label:
        "3.3.2 Gestión integral del ecosistema turistico y el fortalecimiento de la promoción y el mercadeo, para el mejoramiento de la competitividad turística. ",
    },
    { value: "3.3.3", label: "3.3.3 Fortalecimiento de la Infraestructura Turística. " },
    {
      value: "3.4.1",
      label:
        "3.4.1 Desarrollo empresarial de base tecnológica y su integración al distrito de CTeI Regional Metropolitano. ",
    },
    {
      value: "3.4.2",
      label: "3.4.2 Fortalecimiento de las capacidades digitales y la adopción de nuevas tecnologías 4.0. ",
    },
    { value: "3.4.3", label: "3.4.3 Fortalecimiento de la Infraestructura Tecnológica para la competitividad. " },
    { value: "3.4.4", label: "3.4.4 Hacia un territorio inteligente. " },
    { value: "4.1.1", label: "4.1.1 Desarrollo integral de la primera infancia. " },
    {
      value: "4.1.2",
      label: "4.1.2 Fortalecimiento de la infraestructura para el desarrollo integral de la primera infancia. ",
    },
    { value: "4.10.1", label: "4.10.1 Fortalecimiento integral de las víctimas del conflicto. " },
    {
      value: "4.11.1",
      label:
        "4.11.1 Programa integral de seguridad  e instrumentos de planificación y gestión como el plan de seguridad. ",
    },
    {
      value: "4.11.2",
      label:
        "4.11.2 Reconstrucción del Tejido Social a través del Arte y el Deporte para la convivencia en copacabana. ",
    },
    {
      value: "4.11.3",
      label: "4.11.3 Implementar soluciones comunitarias y tecnológicas para la prevención del delito. ",
    },
    {
      value: "4.2.1",
      label: "4.2.1 Desarrollo integral, las capacidades especiales y los talentos excepcionales de la niñez. ",
    },
    { value: "4.3.1", label: "4.3.1 Fortalecimiento y protección integral del adulto mayor. " },
    { value: "4.4.1", label: "4.4.1 Fortalecimiento integral de la juventud. " },
    { value: "4.5.1", label: "4.5.1 Desarrollo integral de las mujeres. " },
    { value: "4.6.1", label: "4.6.1 Fortalecimiento  integral de de la población LGTIQA+. " },
    { value: "4.7.1", label: "4.7.1 Fortalecimiento  integral de de la población en condición de discapacidad. " },
    { value: "4.8.1", label: "4.8.1 Fortalecimiento y atención   integral de de la población habitante de calle. " },
    { value: "4.9.1", label: "4.9.1 Inclusión del sector religioso y fortalecimiento del culto religioso. " },
    {
      value: "5.1.1",
      label:
        "5.1.1 Fortalecimiento de la hacienda publica municpal y la  gestión de recursos para el municipio de copacabana. ",
    },
    {
      value: "5.1.2",
      label:
        "5.1.2 Modernización institucional y de instrumentos técnicos y tecnológicos para mejorar la prestación de los servicios de manera cercana para los ciudadanos de copacabana. ",
    },
    {
      value: "5.2.1",
      label:
        "5.2.1 Fortalecimiento de la participación y la gestión pública para el desarrollo de procesos de articulación y transparencia en torno a la legitimidad y confianza comunitaria en la administración de Copacabana. ",
    },
    {
      value: "5.3.1",
      label:
        "5.3.1 Fortalecimiento integral del bienestar del personal articulada a la gestión pública en copacabana. ",
    },
  ]

  const opcionesIndicadores = [
    { value: "", label: "Seleccionar..." },
    {
      value: "1.1.1.1",
      label:
        '1.1.1.1 Campañas de Salud en Zonas descentralizadas, en el marco de "Salud en mi barrio y mi vereda", realizadas. ',
    },
    {
      value: "1.1.1.2",
      label:
        "1.1.1.2 Cobertura de servicios de primer nivel de complejidad para la Población No Asegurada - PNA que demanda la atención. ",
    },
    { value: "1.1.1.3", label: "1.1.1.3 Cobertura del aseguramiento en salud del Régimen Subsidiado. " },
    {
      value: "1.1.1.4",
      label:
        "1.1.1.4 Acciones para impactar la cobertura en salud de los habitantes, realizando depuración de base de datos, encuestas Sisbén, afiliaciones al régimen subsidiado, afiliaciones a través del SAT, afiliaciones institucionales, seguimiento a recién nacidos y gestión PNA. ",
    },
    {
      value: "1.1.2.1",
      label:
        "1.1.2.1 Acciones como jornadas para la prevención, rutas de intervención, acompañamiento familiar y campañas de divulgación y formación en temas de consumo de sustancias psicoactivas implementadas. ",
    },
    { value: "1.1.2.2", label: "1.1.2.2 Víctimas de violencias sexuales identificadas, con atención integral. " },
    { value: "1.1.2.3", label: "1.1.2.3 Campañas en temas de salud sexual y reproductiva implementadas. " },
    {
      value: "1.1.2.4",
      label:
        "1.1.2.4 Difusiones de la situación de salud realizadas en las comunidades organizadas, mediante boletines epidemiológicos que serán compartidos por las redes sociales de la alcaldía municipal. ",
    },
    {
      value: "1.1.2.5",
      label:
        "1.1.2.5 Acciones de educación a través de campañas educativas, capacitaciones y acompañamientos para la salud oral realizadas. ",
    },
    { value: "1.1.2.6", label: "1.1.2.6 Visitas a establecimientos de interés sanitario realizadas. " },
    {
      value: "1.1.2.7",
      label:
        "1.1.2.7 Cumplimiento del Plan de Intervenciones Colectivas bajo la estrategia Atención Primaria en Salud. ",
    },
    {
      value: "1.1.2.8",
      label:
        "1.1.2.8 Campañas de detección temprana, de educación en salud y orientación para la promoción y prevención de condiciones crónicas prevalentes realizadas. ",
    },
    {
      value: "1.1.2.9",
      label:
        "1.1.2.9 Campañas para abordar situaciones de salud relacionadas con condiciones ambientales implementadas. ",
    },
    { value: "1.1.2.10", label: "1.1.2.10 Vacunas contra la rabia para perros y gatos aplicadas en el municipio. " },
    {
      value: "1.1.2.11",
      label: "1.1.2.11 Personas beneficiadas en las acciones para la prevención y atención de alteraciones visuales. ",
    },
    {
      value: "1.1.2.12",
      label: "1.1.2.12 Campañas para abordar situaciones prevalentes de origen laboral implementadas. ",
    },
    {
      value: "1.1.2.13",
      label:
        "1.1.2.13 Sesiones grupales de apoyo psicosocial para el trámite de experiencias asociadas con la conducta suicida realizados. ",
    },
    {
      value: "1.1.2.14",
      label:
        "1.1.2.14 Sesiones de capacitación sobre el reconocimiento de las habilidades para la vida dirigida a la comunidad en general realizadas. ",
    },
    {
      value: "1.1.2.15",
      label:
        "1.1.2.15 Acciones de salud pública como campañas, jornadas de concientización y capacitaciones  realizadas para el autocuidado y la promoción de hábitos de vida saludable con la comunidad en general. ",
    },
    { value: "1.1.2.16", label: "1.1.2.16 Encuentros y capacitaciones sobre salud mental realizados. " },
    {
      value: "1.1.2.17",
      label: "1.1.2.17 Índice de Riesgo de la Calidad del Agua - IRCA para consumo humano – municipal. ",
    },
    {
      value: "1.1.2.18",
      label: "1.1.2.18 Acciones en salud mental y hábitos de vida sanos dirigidas a los grupos de adulto mayor. ",
    },
    {
      value: "1.1.2.19",
      label:
        "1.1.2.19 Acciones como capacitaciones, acompañamientos a grupos poblacionales, divulgación y promoción en medios de comunicación, entre otros, en salud mental y hábitos de vida sanos dirigidas a las instituciones educativas. ",
    },
    {
      value: "1.1.2.20",
      label: "1.1.2.20 Personas beneficiadas con la estrategia Te escuchamos: Copacabana como un entorno protector. ",
    },
    {
      value: "1.1.3.1",
      label:
        "1.1.3.1 Transferencia para el fortalecimiento de la Red Pública de servicios de salud de la ESE Hospital Santa Margarita de Copacabana realizada por la Secretaría de Salud. ",
    },
    { value: "1.1.4.1", label: "1.1.4.1 Ejecución de los recursos del Fondo Local de Salud. " },
    {
      value: "1.1.4.2",
      label:
        "1.1.4.2 Satisfacción de los usuarios que acceden a los servicios de salud en la red prestadora del municipio. ",
    },
    {
      value: "1.1.4.3",
      label: "1.1.4.3 PQRSD relacionadas a Inspección, Vigilancia y Control Sanitario (IVC) atendidas. ",
    },
    { value: "1.1.4.4", label: "1.1.4.4 Cumplimiento en la capacidad de gestión en salud. " },
    {
      value: "1.1.4.5",
      label: "1.1.4.5 Cumplimiento del Plan de Acción de la Política Pública de Participación Social en Salud. ",
    },
    {
      value: "1.2.1.1",
      label:
        "1.2.1.1 Espacios para Aprender: Infraestructura educativa mejorada para la Innovación y Calidad Educativa. ",
    },
    {
      value: "1.2.1.2",
      label: "1.2.1.2 Sedes Educativas dotadas con mobiliario para un entorno de aprendizaje adecuado y funcional. ",
    },
    { value: "1.2.1.3", label: "1.2.1.3 Estrategia de tránsito armónico actualizada e implementada. " },
    {
      value: "1.2.1.4",
      label:
        "1.2.1.4 Estudiantes en proceso de transición, beneficiados con la estrategia de tránsito armónico en primera infancia. ",
    },
    {
      value: "1.2.1.5",
      label: "1.2.1.5 Personas beneficiadas con la estrategia Educación sin barreras: Unidad de Atención Integral. ",
    },
    {
      value: "1.2.1.6",
      label:
        "1.2.1.6 Estrategia 'Educación sin barreras' para la atención integral de estudiantes en situación de discapacidad, creada e implementada. ",
    },
    {
      value: "1.2.1.7",
      label: "1.2.1.7 Número de estudiantes beneficiados con el Programa de Alimentación Escolar (PAE) implementado. ",
    },
    {
      value: "1.2.1.8",
      label:
        "1.2.1.8 Estrategia formulada e implementada del Consultorio Educativo para el fortalecimiento académico de estudiantes de las EE. ",
    },
    { value: "1.2.1.9", label: "1.2.1.9 Estudiantes beneficiados por la estrategia del Consultorio Educativo. " },
    {
      value: "1.2.1.10",
      label:
        "1.2.1.10 Estudiantes beneficiados con tiquetes urbanos y rurales entregados para los estudiantes del municipio. ",
    },
    { value: "1.2.2.1", label: "1.2.2.1 Formulación, aprobación y socialización del Plan Educativo Municipal. " },
    {
      value: "1.2.2.2",
      label: "1.2.2.2 Foros de educación como escenarios de participación, diálogo y reflexión implementados. ",
    },
    { value: "1.2.2.3", label: "1.2.2.3 Estrategias de Bilingüismo implementadas. " },
    { value: "1.2.2.4", label: "1.2.2.4 Personas beneficiadas con estrategias de promoción del bilingüismo. " },
    { value: "1.2.2.5", label: "1.2.2.5 Cátedra municipal de Historia Local creada e implementada. " },
    { value: "1.2.2.6", label: "1.2.2.6 Sedes educativas con la cátedra municipal de Historia Local Implementada. " },
    {
      value: "1.2.2.7",
      label: "1.2.2.7 Programa de estímulos para la permanencia y calidad educativa creado y ejecutado. ",
    },
    {
      value: "1.2.2.8",
      label:
        "1.2.2.8 Jornadas de estímulos en el marco del programa de estímulos para la permanencia y calidad educativa. ",
    },
    {
      value: "1.2.2.9",
      label:
        "1.2.2.9 Docentes de las instituciones educativas oficiales capacitados en ámbitos técnicos, tecnológicos y de actualización académica/metodológica. ",
    },
    {
      value: "1.2.2.10",
      label:
        "1.2.2.10 Estrategia de reconocimiento y fortalecimiento de prácticas educativas innovadoras creado e implementado. ",
    },
    {
      value: "1.2.2.11",
      label:
        "1.2.2.11 Estrategia de bienestar para la comunidad educativa creada e implementada (físico, emocional y social). ",
    },
    {
      value: "1.2.2.12",
      label:
        "1.2.2.12 Docentes de las instituciones educativas oficiales beneficiados por la estrategia de bienestar docente. ",
    },
    {
      value: "1.2.2.13",
      label:
        "1.2.2.13 Establecimientos educativos articulados a los programas y estrategias de la administración municipal. ",
    },
    {
      value: "1.2.2.14",
      label:
        "1.2.2.14 Programas y estrategias de la administración en el marco de la articulación con las instituciones educativas. ",
    },
    {
      value: "1.2.2.15",
      label: "1.2.2.15 Procesos de articulación entre primera infancia y el sector educativo oficial implementados. ",
    },
    {
      value: "1.2.2.16",
      label:
        "1.2.2.16 Personas impactadas en los procesos de articulación entre primera infancia y el sector educativo oficial. ",
    },
    {
      value: "1.2.2.17",
      label:
        "1.2.2.17 Personas beneficiadas con estrategias de educación para el acceso a la educación técnica, tecnológica y profesional. ",
    },
    { value: "1.2.2.18", label: "1.2.2.18 Fondo de educación superior creado. " },
    { value: "1.2.2.19", label: "1.2.2.19 Puntaje promedio en Pruebas Saber. " },
    {
      value: "1.2.2.20",
      label:
        "1.2.2.20 Estudiantes de último grado de establecimientos públicos beneficiados con programas de preuniversitario y preicfes como fortalecimiento al acceso de la educación superior. ",
    },
    {
      value: "1.2.2.21",
      label:
        "1.2.2.21 Beneficiarios de estrategias o programas de fomento para el acceso a la educación superior o terciaria. ",
    },
    {
      value: "1.2.2.22",
      label:
        "1.2.2.22 Programa de Orientación Vocacional, intereses y motivaciones para el proyecto de vida de los estudiantes de las instituciones educativas oficiales, creado e implementado. ",
    },
    {
      value: "1.2.2.23",
      label:
        "1.2.2.23 Estudiantes de media académica beneficiados con el programa de orientación vocacional, intereses y motivaciones para el proyecto de vida. ",
    },
    {
      value: "1.2.3.1",
      label:
        "1.2.3.1 Acciones como capacitaciones, asesorías a instituciones educativas oficiales, integración a PEI, acompañamientos a docentes, directivos docentes y estudiantes para el fortalecimiento del Ecosistema educativo 4.0. ",
    },
    { value: "1.2.3.2", label: "1.2.3.2 Estrategia del Ecosistema Educativo 4.0 creada e implementada. " },
    {
      value: "1.2.3.3",
      label:
        "1.2.3.3 Programa STEAM: habilidades en ciencia, tecnología, educación, arte y matemáticas, creado e implementado. ",
    },
    { value: "1.2.3.4", label: "1.2.3.4 Estudiantes beneficiados por el programa STEAM Copacabana. " },
    { value: "1.2.3.5", label: "1.2.3.5 Estrategia Educación con vos creada e implementada. " },
    { value: "1.2.3.6", label: "1.2.3.6 Personas beneficiadas con la estrategia: Educación con Vos. " },
    { value: "1.2.3.7", label: "1.2.3.7 Estrategia de 'Cero anafabetismo' actualizada e implementada. " },
    { value: "1.2.3.8", label: "1.2.3.8 Personas beneficiadas con la estrategia de alfabetización. " },
    { value: "1.2.3.9", label: "1.2.3.9 Estrategia 'El Alcalde en Tu Colegio' creada e implementada. " },
    {
      value: "1.2.3.10",
      label:
        "1.2.3.10 Visitas a las instituciones educativas desde la estrategia 'El Alcalde en Tu Colegio' realizadas. ",
    },
    {
      value: "1.3.1.1",
      label: "1.3.1.1 Plan de estímulos, becas y reconocimientos para los artistas locales implementado. ",
    },
    { value: "1.3.1.2", label: "1.3.1.2 Capacitaciones técnicas sobre normativas y proyectos anualmente. " },
    { value: "1.3.1.3", label: "1.3.1.3 Estrategia del nodo de economía cultural y creativa gestionado. " },
    {
      value: "1.3.1.4",
      label: "1.3.1.4 Estrategia InnovArte para Impulso a la Economía Creativa de Copacabana implementada. ",
    },
    { value: "1.3.1.5", label: "1.3.1.5 Sistema de circulación artístico y cultural implementado. " },
    {
      value: "1.3.1.6",
      label: "1.3.1.6 Programa de desarrollo de habilidades artísticas para la profesionalización. ",
    },
    {
      value: "1.3.2.1",
      label:
        "1.3.2.1 Acciones de divulgación e intervención para gestión, protección y salvaguardia del patrimonio cultural realizadas. ",
    },
    {
      value: "1.3.2.2",
      label:
        "1.3.2.2 Estrategia 'Copacabana es mi pueblo', como estrategia de preservación, conservación y divulgación del patrimonio cultural, implementada.  como estrategia de preservación, conservación y divulgación del patrimonio cultural, implementada. ",
    },
    { value: "1.3.2.3", label: "1.3.2.3 Escuela de vigías del patrimonio cultural creada. " },
    { value: "1.3.2.4", label: "1.3.2.4 Inventario del Patrimonio material e inmaterial realizado. " },
    { value: "1.3.2.5", label: "1.3.2.5 Planes de manejo Arqueológico realizados. " },
    { value: "1.3.2.6", label: "1.3.2.6 Planes Especiales de Manejo y Protección implementados. " },
    { value: "1.3.2.7", label: "1.3.2.7 Plan Especial de Salvaguardia implementado. " },
    {
      value: "1.3.2.8",
      label:
        "1.3.2.8 Estrategia de recuperación e integración de caminos ancestrales, en alianza entre la secretaría de medio ambiente y agricultura con la secretaría de educación y cultura, implementada. ",
    },
    { value: "1.3.3.1", label: "1.3.3.1 Espacios descentralizados para la cultura dotados. " },
    { value: "1.3.3.2", label: "1.3.3.2 Espacios de divulgación e integración cultural fortalecidos y creados. " },
    { value: "1.3.3.3", label: "1.3.3.3 Red municipal de bibliotecas en barrios y veredas creada y fortalecida. " },
    { value: "1.3.3.4", label: "1.3.3.4 Nuevas colecciones adquiridas para la red municipal de bibliotecas. " },
    { value: "1.3.3.5", label: "1.3.3.5 Espacios con Sentido: infraestructura cultural mejorada. " },
    { value: "1.3.3.6", label: "1.3.3.6 Espacios con Sentido: infraestructura cultural construida. " },
    {
      value: "1.3.4.1",
      label:
        "1.3.4.1 Programas de formación y educación cultural, inclusivos, en la Casa de la Cultura implementados. ",
    },
    {
      value: "1.3.4.2",
      label:
        "1.3.4.2 Programas del sector cultural del municipio orientados al acceso y la participación activa de la comunidad fortalecidos. ",
    },
    { value: "1.3.4.3", label: "1.3.4.3 Población en procesos artísticos y culturales formadas anualmente. " },
    {
      value: "1.3.4.4",
      label:
        "1.3.4.4 Plan decenal de Cultura como una herramienta estratégica para la articulación y orientación de las políticas culturales elaborado. ",
    },
    { value: "1.3.4.5", label: "1.3.4.5 Zonas del municipio participantes de la red municipal de bibliotecas. " },
    { value: "1.3.4.6", label: "1.3.4.6 Personas que participan de la red municipal de bibliotecas. " },
    { value: "1.3.4.7", label: "1.3.4.7 Consejo Municipal de Cultura fortalecido. " },
    { value: "1.3.4.8", label: "1.3.4.8 Alianzas para la gestión cultural realizadas. " },
    {
      value: "1.3.4.9",
      label: "1.3.4.9 Intervenciones para apoyar y fortalecer los espacios de participación ciudadana. ",
    },
    { value: "1.3.4.10", label: "1.3.4.10 Sistema municipal de información artística y cultural fortalecido. " },
    { value: "1.3.4.11", label: "1.3.4.11 Festivales y ferias artísticas y culturales realizadas. " },
    {
      value: "1.4.1.1",
      label: "1.4.1.1 Personas que acceden a servicios deportivos, recreativos y de actividad física. ",
    },
    { value: "1.4.1.2", label: "1.4.1.2 Deportes, incluyendo alternativos o no convencionales, ofertados. " },
    { value: "1.4.1.3", label: "1.4.1.3 Niños, niñas, adolescentes y jóvenes inscritos en Escuelas Deportivas. " },
    { value: "1.4.1.4", label: "1.4.1.4 Niños, niñas, adolescentes y jóvenes con talento deportivo incentivados. " },
    {
      value: "1.4.1.5",
      label:
        "1.4.1.5 Jornadas deportivas institucionales de juegos escolares, intercolegiados, departamentales y nacionales. ",
    },
    {
      value: "1.4.1.6",
      label:
        "1.4.1.6 Número de deportistas participantes en juegos escolares, intercolegiados, departamentales y nacionales. ",
    },
    {
      value: "1.4.1.7",
      label:
        '1.4.1.7 Creación de la estrategia "Noches comunitarias" como espacios de descentralización, diversión y esparcimiento para los habitantes. ',
    },
    { value: "1.4.1.8", label: '1.4.1.8 Zonas participantes de las "Noches comunitarias. ""' },
    { value: "1.4.1.9", label: "1.4.1.9 Eventos deportivos interbarriales e interveredales realizados y/o apoyados. " },
    {
      value: "1.4.1.10",
      label:
        "1.4.1.10 Torneos y festivales deportivos y recreativos realizados y/o apoyados de manera descentralizada. ",
    },
    {
      value: "1.4.1.11",
      label:
        "1.4.1.11 Eventos deportivos interinstitucionales con proyección externa al municipio realizados y/o apoyados. ",
    },
    {
      value: "1.4.2.1",
      label: "1.4.2.1 Capacitaciones a los formadores, entrenadores y expertos deportivos brindadas. ",
    },
    {
      value: "1.4.2.2",
      label: "1.4.2.2 Equipo interdisciplinar para el acompañamiento y asesoramiento a deportistas creado. ",
    },
    {
      value: "1.4.2.3",
      label:
        "1.4.2.3 Fondo económico para apoyo a deportistas que representen al municipio en competencias externas creado. ",
    },
    { value: "1.4.2.4", label: "1.4.2.4 Infraestructura deportiva mantenida y mejorada. " },
    { value: "1.4.2.5", label: "1.4.2.5 Infraestructura deportiva construida. " },
    { value: "1.4.3.1", label: "1.4.3.1 Plan Integral de Educación Física y Deporte creado e implementado. " },
    {
      value: "1.4.3.2",
      label: "1.4.3.2 Sedes Educativas con implementación del Plan Integral de Educación Física y Deporte. ",
    },
    { value: "1.4.3.3", label: "1.4.3.3 Establecimiento del INDER Copacabana. " },
    {
      value: "1.4.3.4",
      label:
        "1.4.3.4 Dotación deportiva entregada para brindar condiciones adecuadas en la realización de la actividad deportiva. ",
    },
    { value: "1.4.3.5", label: "1.4.3.5 Alianzas con diferentes actores realizadas para la gestión deportiva. " },
    { value: "2.1.1.1", label: "2.1.1.1 SILAP formulado con gestión para su implementación. " },
    { value: "2.1.1.2", label: "2.1.1.2 Generación de Espacios Públicos Verdes Urbanos. " },
    {
      value: "2.1.1.3",
      label: "2.1.1.3 Estrategia de reforestación y restauración de áreas de importancia ambiental en el municipio. ",
    },
    { value: "2.1.1.4", label: "2.1.1.4 Área total para la protección y conservación de ecosistemas naturales. " },
    { value: "2.1.2.1", label: "2.1.2.1 Áreas con PSA. " },
    { value: "2.1.2.2", label: "2.1.2.2 Intervenciones en acueductos veredales para su mejora y fortalecimiento. " },
    {
      value: "2.1.2.3",
      label:
        "2.1.2.3 Acciones integrales con capacitaciones, sensibilizaciones, acompañamientos y monitoreos para Protección y Gestión Sostenible del Agua implementadas. ",
    },
    { value: "2.1.2.4", label: "2.1.2.4 Análisis hidrológico de cuencas con enfoque regenerativo. " },
    {
      value: "2.1.2.5",
      label:
        "2.1.2.5 Intervenciones mediante descontaminación en el Sistema de alcantarillado, pozos sépticos y control de descargas directas para su fortalecimiento. ",
    },
    {
      value: "2.1.3.1",
      label:
        "2.1.3.1 Acciones de planificación, gestión, control y monitoreo ambiental en Copacabana implementadas para enfrentar los fenómenos del cambio climático. ",
    },
    { value: "2.1.3.2", label: "2.1.3.2 Diseño de ruta estratégica para adaptación al cambio climático. " },
    {
      value: "2.1.3.3",
      label:
        "2.1.3.3 Diseño e implementación del plan de ahorro y eficiencia energética para la administración pública, y la promoción de energías renovables. ",
    },
    {
      value: "2.1.3.4",
      label:
        "2.1.3.4 Acciones enfocadas en la implementación de medidas de adaptación y resiliencia de la infraestructura. ",
    },
    {
      value: "2.1.4.1",
      label:
        "2.1.4.1 Campañas de capacitación y sensibilización en cambio climático, adaptación y gestión del riesgo. ",
    },
    {
      value: "2.1.4.2",
      label:
        "2.1.4.2 Campañas de capacitación y sensibilización en manejo integral de residuos sólidos y sostenibilidad. ",
    },
    {
      value: "2.1.4.3",
      label:
        "2.1.4.3 Estrategia para el mejoramiento y construcción de espacios para la formacin e investigación ambiental. ",
    },
    {
      value: "2.1.4.4",
      label: "2.1.4.4 Acciones enfocadas en impulsar la educación ambiental y la transformación cultural. ",
    },
    { value: "2.1.5.1", label: "2.1.5.1 Plan de Gestión Integral de Residuos actualizado. " },
    {
      value: "2.1.5.2",
      label:
        "2.1.5.2 Acciones implementadas para la formalización de recuperadores y el fortalecimiento de empresas de reciclaje. ",
    },
    { value: "2.1.6.1", label: "2.1.6.1 Acciones con enfoque en economía circular. " },
    { value: "2.1.6.2", label: "2.1.6.2 Acciones enfocadas en acompañamiento, control y vigilancia ambiental. " },
    { value: "2.1.6.3", label: "2.1.6.3 Programa participativo de Sello Ambiental. " },
    {
      value: "2.2.1.1",
      label:
        "2.2.1.1 Política pública de bienestar animal para la protección y promoción del bienestar de los animales diseñada. ",
    },
    { value: "2.2.1.2", label: "2.2.1.2 Creación de Infraestructura y Unidades de Atención y Bienestar Animal. " },
    {
      value: "2.2.1.3",
      label:
        "2.2.1.3 Cátedra de Bienestar animal implementada en las instituciones educativas oficiales del municipio. ",
    },
    {
      value: "2.2.1.4",
      label: "2.2.1.4 Atención integral a animales en condición de vulnerabilidad reportados y/o identificados. ",
    },
    {
      value: "2.2.1.5",
      label: "2.2.1.5 Campañas de salud, bienestar, adopción y sensibilización para Mascotas realizadas. ",
    },
    { value: "2.3.1.1", label: "2.3.1.1 Plan de Gestión del Riesgo Institucional actualizado. " },
    {
      value: "2.3.1.2",
      label:
        "2.3.1.2 Acciones de control y seguimiento necesario a las especies invasoras del municipio, con mapeo de zonas, seguimiento a tendencias, divulgación a la comunidad,  realizadas. ",
    },
    {
      value: "2.3.1.3",
      label:
        "2.3.1.3 Acciones Correctivas y Preventivas, a través de medios comunicacionales, visitas a sitios, capacitaciones y formaciones, realizadas en torno a la gestión integral del riesgo de desastres. ",
    },
    {
      value: "2.3.2.1",
      label:
        "2.3.2.1 Estrategia de Verificación Cumplimiento Normativo y Supervisión de Construcciones diseñada e implementada. ",
    },
    { value: "2.3.3.1", label: "2.3.3.1 Sistemas de Monitoreo y Alerta Temprana implementados. " },
    { value: "2.3.3.2", label: "2.3.3.2 Nueva Sede de Bomberos actualizada y con condiciones adecuadas. " },
    { value: "2.3.3.3", label: "2.3.3.3 Dotación de organismos de socorro y salvaguardia gestionados. " },
    { value: "2.4.1.1", label: "2.4.1.1 Copacabana con Vivienda Digna: Mejoramiento de viviendas realizados. " },
    {
      value: "2.4.1.2",
      label: "2.4.1.2 Copacabana con Vivienda Digna: construcciones de vivienda nueva viabilizadas. ",
    },
    {
      value: "2.4.1.3",
      label:
        "2.4.1.3 Personas beneficiadas con asesoría integral para acceder a beneficios económicos para proyectos de vivienda de interés social (VIS), vivienda de interés prioritario (VIP) y mejoramiento de vivienda. ",
    },
    { value: "2.4.1.4", label: "2.4.1.4 Iniciativas de saneamiento y titulación de bienes fiscales ejecutadas. " },
    {
      value: "2.5.1.1",
      label:
        "2.5.1.1 Acciones de fortalecimiento de la Movilidad en Copacabana, como campañas de sensibilización, asesorías, capacitaciones y acompañamientos, de manera sostenible y con enfoque diferencial implementadas. ",
    },
    {
      value: "2.5.1.2",
      label: "2.5.1.2 Plan integral para el mejoramiento de la movilidad en el municipio de Copacabana diseñado. ",
    },
    { value: "2.5.1.3", label: "2.5.1.3 Parque automotor Público mejorado. " },
    {
      value: "2.5.2.1",
      label: "2.5.2.1 Intervenciones para lograr la mejora y/o ampliación de la infraestructura vial. ",
    },
    { value: "2.5.2.2", label: "2.5.2.2 Mantenimiento de la infraestructura vial. " },
    {
      value: "2.5.3.1",
      label: "2.5.3.1 Estrategia 'Copacabana, hacia una movilidad innovadora e  inteligente' implementada. ",
    },
    { value: "2.5.3.2", label: "2.5.3.2 Acciones de Educación y Cultura Vial implementadas. " },
    { value: "2.6.1.1", label: "2.6.1.1 Plan Básico de Ordenamiento Territorial de Copacabana actualizado. " },
    { value: "2.6.2.1", label: "2.6.2.1 Infraestructura municipal de Copacabana mejorada o mantenida. " },
    { value: "2.6.2.2", label: "2.6.2.2 Sistema de alumbrado público municipal mejorado y ampliado. " },
    {
      value: "2.6.2.3",
      label:
        "2.6.2.3 Estrategia de integración de espacios públicos seguros, estimulantes y adecuados para niños y niñas diseñada y ejecutada. ",
    },
    { value: "2.6.2.4", label: "2.6.2.4 Espacio público de Copacabana mejorado. " },
    { value: "2.6.2.5", label: "2.6.2.5 Gestionar el aumento de cobertura de la red de gas en la zona veredal. " },
    { value: "3.1.1.1", label: "3.1.1.1 Emprendimientos fortalecidos y promovidos. " },
    { value: "3.1.1.2", label: "3.1.1.2 Estrategias de integración y financiación empresarial implementadas. " },
    {
      value: "3.1.1.3",
      label: "3.1.1.3 Capacitaciones realizadas a emprendimientos para la creación y consolidación de empresa. ",
    },
    { value: "3.1.1.4", label: "3.1.1.4 Eventos para el fomento del emprendimiento realizados. " },
    {
      value: "3.1.2.1",
      label:
        "3.1.2.1 Campañas para la estimulación de la creación, formalización y mejoramiento de emprendimientos realizadas. ",
    },
    { value: "3.1.2.2", label: "3.1.2.2 Estrategia 'Emprendimiento para el Futuro' implementada. " },
    {
      value: "3.1.2.3",
      label:
        "3.1.2.3 Acciones de formación para generación de competencias y habilidades (empleos de futuro e industria Tech) realizadas. ",
    },
    { value: "3.1.2.4", label: "3.1.2.4 Convenios público/privados para el fortalecimiento del empleo realizados. " },
    {
      value: "3.1.3.1",
      label: "3.1.3.1 Empresas entorno a la estrategia de 'Semaforización empresarial' clasificadas. ",
    },
    {
      value: "3.1.3.2",
      label: "3.1.3.2 Estrategia de semaforización empresarial para la sostenibilidad implementada. ",
    },
    {
      value: "3.1.3.3",
      label: "3.1.3.3 Incentivos tributarios para empresas que se asienten en el municipio generados. ",
    },
    { value: "3.1.3.4", label: "3.1.3.4 Estrategia 'El alcalde visita tu empresa' implementada. " },
    { value: "3.1.4.1", label: "3.1.4.1 Redes empresariales diseñadas e implementadas. " },
    { value: "3.1.4.2", label: "3.1.4.2 Capacitaciones, asesorías y alianzas con la mesa empresarial realizadas. " },
    {
      value: "3.1.4.3",
      label:
        "3.1.4.3 Red de Negocios Copacabana e integración regional con el distrito de Ciencia, Tecnología e Innovación de Medellín diseñada e implementada. ",
    },
    {
      value: "3.1.5.1",
      label: "3.1.5.1 Acciones de fortalecimiento de la oficina de empleo en Copacabana implementadas. ",
    },
    {
      value: "3.1.5.2",
      label: "3.1.5.2 Acciones para la promoción de empleo de la mano de la oficina pública de empleo implementadas. ",
    },
    { value: "3.2.1.1", label: "3.2.1.1 Plan Agropecuario Municipal (PAM) formulado e implementado. " },
    {
      value: "3.2.1.2",
      label:
        "3.2.1.2 Acciones de fortalecimiento para la producción y comercialización del sector agropecuario, como capacitaciones, acompañamiento, asesorías, entre otras, realizadas. ",
    },
    { value: "3.2.1.3", label: "3.2.1.3 Estrategia de 'eco huertas comunitarias' implementada. " },
    {
      value: "3.2.1.4",
      label:
        "3.2.1.4 Acciones de formación para el desarrollo de capacidades e iniciativas para esquemas asociativos en el sector agropecuario. ",
    },
    { value: "3.2.2.1", label: "3.2.2.1 Estrategia 'Mercado Campesino Sostenible' implementada. " },
    { value: "3.2.2.2", label: "3.2.2.2 Acciones para el desarrollo de cadenas de valor y comercialización. " },
    {
      value: "3.2.2.3",
      label:
        "3.2.2.3 Acciones para que la Plaza de mercado sea un espacio óptimo para la comercialización y el impulso de las cooperativas y/o asociaciones agrícolas y pecuarias mejorada. ",
    },
    { value: "3.3.1.1", label: "3.3.1.1 Política pública de turismo con enfoque sostenible diseñada y expedida. " },
    { value: "3.3.2.1", label: "3.3.2.1 Ecosistema Empresarial Turístico implementado. " },
    {
      value: "3.3.2.2",
      label:
        "3.3.2.2 Acciones de capacitación, acompañamientos, asesorías, divulgación, promoción para implementar el Turismo Comunitario y Cultural en el territorio. ",
    },
    { value: "3.3.2.3", label: "3.3.2.3 Acciones de Endomarketing turístico implementadas. " },
    {
      value: "3.3.2.4",
      label: "3.3.2.4 Asesorías y capacitaciones a los prestadores de servicios turísticos en el municipio. ",
    },
    { value: "3.3.2.5", label: "3.3.2.5 Marca Turística de Copacabana creada. " },
    {
      value: "3.3.2.6",
      label: "3.3.2.6 Estrategia para la promoción de la Marca Municipio de Copacabana implementada. ",
    },
    { value: "3.3.3.1", label: "3.3.3.1 Infraestructura turística mejorada. " },
    {
      value: "3.3.3.2",
      label:
        "3.3.3.2 Estudios de capacidad de carga en los puntos turísticos prioritarios del municipio de Copacabana realizados. ",
    },
    { value: "3.3.3.3", label: "3.3.3.3 Sistema de información turística implementado. " },
    { value: "3.4.1.1", label: "3.4.1.1 Oficina de cooperación internacional, innovación y desarrollo creada. " },
    {
      value: "3.4.1.2",
      label: "3.4.1.2 Reemplazo de fuentes de suministro de energía eléctrica para edificaciones públicas. ",
    },
    {
      value: "3.4.2.1",
      label:
        "3.4.2.1 Acciones de formación en capacidades digitales y la adopción de nuevas tecnologías 4.0 realizadas. ",
    },
    {
      value: "3.4.3.1",
      label:
        "3.4.3.1 Acciones ligadas a la cualificación, actualización digital y dotación tecnológica para la gestión de mejora de la infraestructura tecnológica realizadas. ",
    },
    { value: "3.4.4.1", label: "3.4.4.1 Estrategia Copacabana ciudad inteligente diseñada. " },
    {
      value: "3.4.4.2",
      label:
        "3.4.4.2 Acciones para el acceso y uso de las Tecnologías de la Información y las Comunicaciones implementadas en el marco de Ciudad Inteligente. ",
    },
    {
      value: "4.1.1.1",
      label:
        "4.1.1.1 Estrategia para desarrollo integral de la primera infancia implementada: acceso a los servicios básicos, acompañamiento psicosocial y protección de derechos. ",
    },
    { value: "4.1.1.2", label: "4.1.1.2 Estrategia para la atención integral a madres gestantes implementadas. " },
    {
      value: "4.1.1.3",
      label: "4.1.1.3 Plan Municipal de Prevención Integral de abuso sexual infantil implementada. ",
    },
    {
      value: "4.1.1.4",
      label:
        "4.1.1.4 Acciones de seguimiento, control y mejoras para la seguridad nutricional y alimentaria implementadas. ",
    },
    { value: "4.1.1.5", label: "4.1.1.5 Estrategia de entornos protectores y seguros implementada. " },
    { value: "4.1.2.1", label: "4.1.2.1 Infraestructura mejorada. " },
    {
      value: "4.2.1.1",
      label: "4.2.1.1 Estrategia para el desarrollo integral de la niñez y adolescencia implementada. ",
    },
    {
      value: "4.3.1.1",
      label:
        "4.3.1.1 Adultos mayores beneficiados con acciones de bienestar, fortalecimiento y protección integral implementadas. ",
    },
    {
      value: "4.3.1.2",
      label:
        "4.3.1.2 Política pública de envejecimiento humano y vejez, que incluya los programas de 'Resignificación y protección del adulto mayor' para entornos adecuados y 'Dignidad en la veje' que incluya actividades lúdicas, recreativas, culturales y deportivas actualizada. ",
    },
    { value: "4.3.1.3", label: "4.3.1.3 Acciones de promoción del subsidio de adulto mayor realizadas. " },
    {
      value: "4.3.1.4",
      label: "4.3.1.4 Viabilización de la Construcción y dotación del Centro del Adulto Mayor gestionado. ",
    },
    {
      value: "4.3.1.5",
      label:
        "4.3.1.5 Estrategia de estímulos, incentivos y reconocimientos a los adultos mayores reconociendo su labor y papel en la comunidad realizada. ",
    },
    { value: "4.3.1.6", label: "4.3.1.6 Festival recreativo, cultural, deportivo del adulto mayor realizado. " },
    { value: "4.4.1.1", label: "4.4.1.1 Política pública de juventud actualizada. " },
    { value: "4.4.1.2", label: "4.4.1.2 Estrategia 'STEAM Zone' para formación especializada en STEAM implementada. " },
    {
      value: "4.4.1.3",
      label:
        "4.4.1.3 Programa de acompañamiento integral a jóvenes (emocional, social, económico) creado e implementado. ",
    },
    {
      value: "4.4.1.4",
      label:
        "4.4.1.4 Acciones de seguimiento, formación, acompañamiento y asesoramiento dirigidas al fortalecimiento del Consejo municipal de Juventud y de la plataforma municipal de juventud desarrolladas. ",
    },
    {
      value: "4.4.1.5",
      label:
        "4.4.1.5 Capacitaciones y asesorías a personeros estudiantiles para fortalecer sus labores de líderes y gestores ante el municipio realizadas. ",
    },
    { value: "4.4.1.6", label: "4.4.1.6 Casa de la juventud planeada y creada. " },
    {
      value: "4.4.1.7",
      label:
        "4.4.1.7 Acciones de formación y/o capacitación juvenil para el fortalecimiento de los jóvenes emprendedores del municipio desarrolladas. ",
    },
    {
      value: "4.4.1.8",
      label:
        "4.4.1.8 Convenios público-privados para generar programas de acompañamiento y fortalecimiento de actividades no convencionales y educación no formal para los jóvenes, en el marco del programa 'Más Oportunidades para Nuestros Jóvenes'  realizados. ",
    },
    { value: "4.4.1.9", label: "4.4.1.9 Estrategia 'jóvenes talento' implementada. " },
    {
      value: "4.5.1.1",
      label:
        "4.5.1.1 Acciones de acompañamiento, formación y creación de alianzas para empoderamiento y autonomía femenina implementadas. ",
    },
    { value: "4.5.1.2", label: "4.5.1.2 Estrategia integral 'Mujeres Seguras y Libres de Violencia' implementada. " },
    {
      value: "4.5.1.3",
      label: "4.5.1.3 'La casa morada': un lugar de encuentro para las mujeres y con atención priorizada creada. ",
    },
    {
      value: "4.5.1.4",
      label:
        "4.5.1.4 Programa integral de protección de víctimas de la violencia, líderes sociales y madres cabeza de familia. ",
    },
    { value: "4.5.1.5", label: "4.5.1.5 Red de apoyo de las madres cabeza de hogar creada e implementada. " },
    {
      value: "4.5.1.6",
      label:
        "4.5.1.6 Estrategia integral de promoción y prevención en salud especializada en enfermedades de las mujeres implementada. ",
    },
    {
      value: "4.5.1.7",
      label: "4.5.1.7 Estrategia de creación de escuela de liderazgo Mujeres Líderes y Participativas. ",
    },
    { value: "4.5.1.8", label: "4.5.1.8 Política pública de la mujer actualizada. " },
    { value: "4.5.1.9", label: "4.5.1.9 Dirección municipal de las mujeres en Copacabana creada. " },
  ]

  const opcionesBPIN = [
    { value: "", label: "Seleccionar..." },
    {
      value: "2024052120001",
      label:
        "2024052120001 Construcción de redes de alcantarillado convencional no convencional e interceptor secundario para aguas residuales domésticas en el centropoblado de la vereda El Cabuyal del municipio de   Copacabana Antioquia. ",
    },
    {
      value: "2024052120002",
      label: "2024052120002 Construcción de obra hidráulica en el barrio María sector Acarpín Copacabana. ",
    },
    {
      value: "2024052120003",
      label:
        "2024052120003 Construcción de sistema de contención en la vereda Cabuya sector La Romerita en el municipio de Copacabana. ",
    },
    {
      value: "2024052120004",
      label:
        "2024052120004 Construcción de un sistema de contención en anclaje para la Vereda Alvarado sector La Bola en el municipio de Copacabana. ",
    },
    {
      value: "2024052120005",
      label:
        "2024052120005 Construcción de muro de contención para el barrio La Azulita sector Placa Deportiva en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120006",
      label:
        "2024052120006 Construcción de muro de contención para el barrio Yarumito sector Barrientos en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120007",
      label:
        "2024052120007 Construcción de muro de contención en el sector La Y vereda Quebrada Arriba en el municipio de Copacabana. ",
    },
    {
      value: "2024052120008",
      label:
        "2024052120008 Construcción de muro de contención en la zona Marginal quebrada Piedras Blancas barrio Yarumito en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120009",
      label:
        "2024052120009 Construcción de muro de contención en la vereda Cabuyal Sector Marquitos en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120010",
      label:
        "2024052120010 Construcción de estructura de contención para placa polideportiva en el barrio Las Vegas parte alta Copacabana. ",
    },
    {
      value: "2024052120011",
      label:
        "2024052120011 Fortalecimiento  del Sistema Integrado de Emergencias y Seguridad  SIES con la modernización el Centro de Monitoreo del Municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120012",
      label:
        "2024052120012 Construcción de una infraestructura multidisciplinaria para la formación y circulación artística y cultural de Copacabana. ",
    },
    {
      value: "2024052120013",
      label:
        "2024052120013 Adquisición de unidad móvil de salud para fortalecer el servicio de atención extramural de las actividades de promoción y prevención de ese hospital santa margarita para la comunidad del municipio Copacabana. ",
    },
    {
      value: "2024052120014",
      label:
        "2024052120014 Fortalecimiento de la operación del Cuerpo de Bomberos mediante la adquisición de equipos en el municipio de Copacabana. ",
    },
    {
      value: "2024052120015",
      label:
        "2024052120015 Implementación y actualización de Plan Básico de Ordenamiento Territorial (PBOT) en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120016",
      label:
        "2024052120016 Desarrollo de acciones estratégicas para el fortalecimiento de la gestión institucional en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120017",
      label:
        "2024052120017 Implementación de acciones para la actualización y cobertura del Sisbén en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120018",
      label:
        "2024052120018 Fortalecimiento de la gestión integral de la oferta hídrica y saneamiento básico en el Municipio Copacabana Antioquia. ",
    },
    {
      value: "2024052120019",
      label: "2024052120019 Fortalecimiento del Bienestar animal y la tenencia responsable Copacabana Antioquia. ",
    },
    {
      value: "2024052120020",
      label:
        "2024052120020 Fortalecimiento de la educación y cultura ambiental territorializada en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120021",
      label:
        "2024052120021 Implementación de medidas para la protección conservación y restauración de los ecosistemas naturales de alto valor ecológico cultural y social del municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120022",
      label:
        "2024052120022 Implementación de acciones para la gestión integral de residuos sólidos en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120023",
      label:
        "2024052120023 Apoyo al fortalecimiento y desarrollo de cadenas de valor y promoción de productos locales en el Municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120024",
      label:
        "2024052120024 Fortalecimiento del Desarrollo Agropecuario Sostenible en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120025",
      label:
        "2024052120025 Implementación de estrategias para mitigación y adaptación del cambio climático Copacabana Antioquia. ",
    },
    {
      value: "2024052120026",
      label:
        "2024052120026 Fortalecimiento de la Producción Verde y Responsable del municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120027",
      label:
        "2024052120027 Fortalecimiento y mejoramiento de la gestión  administrativa de los procesos internos  y de las Tecnologías de la información y las Comunicaciones del municipio de Copacabana Copacabana.",
    },
    {
      value: "2024052120028",
      label:
        "2024052120028 Fortalecimiento de la gestión del talento humano y bienestar laboral del municipio de Copacabana. ",
    },
    {
      value: "2024052120029",
      label: "2024052120029 Desarrollo integral a niños, niñas y adolescentes en el municipio de Copacabana. ",
    },
    {
      value: "2024052120030",
      label:
        "2024052120030 Desarrollo e implementación de procesos y estrategias efectivas que impulsen el fortalecimiento integral del desarrollo económico en   Copacabana Antioquia. ",
    },
    {
      value: "2024052120031",
      label:
        "2024052120031 Fortalecimiento integral a las victimas del conflicto armado y su reparación brindarles apoyo para superar y reencontrar  su salud mental económico y social en el Municipio Copacabana. ",
    },
    {
      value: "2024052120032",
      label:
        "2024052120032 Fortalecimiento de la participación ciudadana de las organizaciones de la sociedad civil comunitarias yo comunales en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120033",
      label:
        "2024052120033 Fortalecimiento de las estrategias para  el desarrollo integral de las mujeres y el cumplimiento de sus derechos  en el municipio de Copacabana. ",
    },
    {
      value: "2024052120034",
      label:
        "2024052120034 Construcción de acciones estratégicas para el fortalecimiento integral de los adolescentes y jóvenes del municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120035",
      label:
        "2024052120035 Apoyo y atención integral a la población que se encuentra en situación de calle del municipio de Copacabana. ",
    },
    {
      value: "2024052120036",
      label:
        "2024052120036 Implementación de acciones y estrategias para ampliar la oferta institucional que permita una atención integral para las personas con discapacidad sus familias yo cuidadores. Copacabana. ",
    },
    {
      value: "2024052120037",
      label:
        "2024052120037 Implementación de un ecosistema turístico orientado al crecimiento económico y comunitario con un enfoque integral sostenible e incluyente para el municipio de  Copacabana. ",
    },
    {
      value: "2024052120038",
      label:
        "2024052120038 Implantación del programa integral de seguridad e instrumentos de planificación y gestión como el plan de seguridad para el mejoramiento de la seguridad y convivencia ciudadana en el municipio de Copacabana. ",
    },
    {
      value: "2024052120039",
      label:
        "2024052120039 Reconstrucción del tejido social a través del arte y el deporte para la promoción de la sana convivencia y la prevención de delitos en el municipio de  Copacabana Antioquia. ",
    },
    {
      value: "2024052120040",
      label:
        "2024052120040 Implantación de soluciones comunitarias y con la modernización tecnológica enfocada en la prevención del delito en el municipio de Copacabana. ",
    },
    {
      value: "2024052120041",
      label:
        "2024052120041 Fortalecimiento de la Movilidad Sostenible con enfoque diferencial en el municipio de Copacabana. ",
    },
    {
      value: "2024052120042",
      label:
        "2024052120042 Implementación de un Sistema de Movilidad Innovador e inteligente en el municipio de Copacabana. ",
    },
    {
      value: "2024052120043",
      label:
        "2024052120043 Construcción de gimnasios al aire libre en la zona urbana y rural en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120044",
      label: "2024052120044 Construcción de la piscina semi olímpica del municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120045",
      label: "2024052120045 Modernización de la unidad deportiva principal en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120046",
      label:
        "2024052120046 Construcción y dotación de Placas Polideportivas cubiertas rurales en el municipio de Copacabana. ",
    },
    {
      value: "2024052120047",
      label:
        "2024052120047 Mantenimiento integral de la infraestructura educativa para el desarrollo, la educación y la pedagogía en el municipio de Copacabana. ",
    },
    {
      value: "2024052120048",
      label:
        "2024052120048 Optimización y mantenimiento de acueductos veredales en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120049",
      label:
        "2024052120049 Mejoramiento y mantenimiento de Infraestructura pública en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120050",
      label:
        "2024052120050 Renovación y mantenimiento del Espacio Público disponible en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120051",
      label:
        "2024052120051 Mejoramiento y mantenimiento de la infraestructura Vial urbana y rural disponible en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120052",
      label:
        "2024052120052 Mantenimiento, reposición y expansión del Sistema de Alumbrado Público disponible en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120053",
      label:
        "2024052120053 Mejoramiento y mantenimiento de la infraestructura deportiva disponible en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120054",
      label:
        "2024052120054 Mejoramiento de viviendas dignas para los habitantes del municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120055",
      label:
        "2024052120055 Implantación de una gestión del riesgo integral de desastres en el municipio de Copacabana. ",
    },
    {
      value: "2024052120056",
      label:
        "2024052120056 Fortalecimiento de la comunicación y la Infraestructura Tecnológica para la competitividad en el municipio Copacabana Antioquia. ",
    },
    {
      value: "2024052120057",
      label:
        "2024052120057 Fortalecimiento de la hacienda pública y la gestión de recursos en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120058",
      label: "2024052120058 Fortalecimiento Integral pedagógico y educativo en el municipio de Copacabana. ",
    },
    {
      value: "2024052120059",
      label:
        "2024052120059 Fortalecimiento del acceso y permanencia en el sistema educativo desde un enfoque territorial en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120060",
      label:
        "2024052120060 Fortalecimiento de la capacidad de gestión en el sector cultural a través de la gobernanza cultural eficiente la formación y promoción artística vocacional para la protección y salvaguardia del patrimonio cultura en el municipio de Copacabana. ",
    },
    {
      value: "2024052120061",
      label:
        "2024052120061 Fortalecimiento y mantenimiento de sistemas de saneamiento básico, alcantarillados y pozos sépticos en el municipio de Copacabana. ",
    },
    {
      value: "2024052120062",
      label:
        "2024052120062 Fortalecimiento de los servicios de salud hacia la descentralización ampliando la cobertura de atención en salud  en el municipio de Copacabana. ",
    },
    {
      value: "2024052120063",
      label: "2024052120063 Fortalecimiento de los niveles de gobernanza de la salud en el municipio de Copacabana. ",
    },
    {
      value: "2024052120064",
      label: "2024052120064 Fortalecimiento y protección integral del adulto mayor en el municipio de Copacabana. ",
    },
    {
      value: "2024052120065",
      label:
        "2024052120065 Fortalecimiento del Programa de Alimentación Escolar-PAE en las Instituciones y sedes educativas oficiales del municipio de Copacabana. ",
    },
    {
      value: "2024052120066",
      label:
        "2024052120066 Implementación de estrategias para garantizar el desarrollo de acciones que generen estilos de vida saludables en el municipio de Copacabana. ",
    },
    {
      value: "2024052120067",
      label:
        "2024052120067 Mejoramiento y dotación de la infraestructura cultural en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120068",
      label:
        "2024052120068 Fortalecimiento de la practica deportiva la formación y preparación de deportistas aficionados y de alto rendimiento en el municipio de   Copacabana. ",
    },
    {
      value: "2024052120069",
      label:
        "2024052120069 Fortalecimiento del secetor religioso espacios de participación y protección del derecho a la libre expresión de culto en el Municipio de  Copacabana. ",
    },
    {
      value: "2024052120070",
      label:
        "2024052120070 Fortalecimiento de las capacidades diversas en el cuidado y defensa de los Derechos humanos enfocados en la población LGBTIQA+ delMunicipio de Copacabana Copacabana Copacabana. ",
    },
    {
      value: "2024052120071",
      label: "2024052120071 Remodelación del parque principal SIMÓN BOLÍVAR en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120072",
      label:
        "2024052120072 Implementación y actualización del Plan Básico de Ordenamiento Territorial (PBOT) en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120073",
      label: "2024052120073 Mejoramiento de Parques Infantiles y Gimnasios al aire Libre Copacabana. ",
    },
    {
      value: "2024052120074",
      label:
        "2024052120074 Fortalecimiento de la cultura deportiva para el fomento a la recreación, la actividad física y el deporte en el municipio de Copacabana. ",
    },
    {
      value: "2024052120075",
      label:
        "2024052120075 Desarrollo del liderazgo en gobernanza para la gestión deportiva en el municipio de Copacabana. ",
    },
    {
      value: "2024052120076",
      label:
        "2024052120076 Fortalecimiento de la capacidad institucional y operativa para la atención de emergencias a través del cuerpo de bomberos voluntarios mediante la dotación de un vehículo transportador de agua (CISTERNA) en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120077",
      label:
        "2024052120077 Elaboración de los estudios y diseños para la construcción de la Estación de Policía y la Sede de Bomberos en el municipio de Copacabana Antioquia. ",
    },
    {
      value: "2024052120078",
      label:
        "2024052120078 Fortalecimiento DE LOS PROGRAMA DE ATENCIÓN SOCIAL PARA MEJORAR LA CALIDAD DE VIDA DE LAS PERSONAS ADULTOS MAYORES DEL MUNICIPIO DE  Copacabana Antioquia. ",
    },
    {
      value: "2024052120079",
      label:
        "2024052120079 Implantación de estrategias para garantizar el desarrollo de acciones que generen estilos de vida saludables en el municipio de Copacabana. ",
    },
    {
      value: "2024052120080",
      label: "2024052120080 Fortalecimiento de los niveles de gobernanza de la salud en el municipio de Copacabana. ",
    },
    {
      value: "2024052120081",
      label:
        "2024052120081 Construcción del centro cultural multidisciplinario para la formación circulación y presentaciones artísticas en la zona norte del departamento de Copacabana Antioquia. ",
    },
    {
      value: "2024052120082",
      label:
        "2024052120082 Desarrollo de un ecosistema educativo 4.0 que apunte al fortalecimiento y encadenamiento de los diferentes niveles educativos en el municipio de Copacabana. ",
    },
  ]

  const [contract, setContract] = useState({
    fechaSolicitud: "",
    centroCostos: "",
    secretaria: "",
    tipoContrato: "",
    modalidadSeleccion: "",
    objetoContractual: "",
    duracionEstimada: "",
    nombreContratista: "",
    programa: "",
    programa_aprobado: false,
    indicador: "",
    indicador_aprobado: false,
    bpin: "",
    bpin_aprobado: false,
    naturalezaGasto: "",
    presupuestoTotal: "",
    discriminacionRubros: "",
    rubro: "",
    nombreRubro: "",
    valor: "",
    formaPago: "",
    nombreSolicitante: "",
    cargoSolicitante: "",
    firmaSolicitante: "",
    aprobacionAdministrativa: "",
    firmaAdministrativa: "",
    aprobacionHacienda: "",
    firmaHacienda: "",
    aprobacionAlcalde: "",
    firmaAlcalde: "",
    numeroActa: "",
    fechaComite: "",
    observaciones: "",
    radicado: "",
    current_phase: 1,
    status: "en_proceso",
  })

  // Cargar información del usuario y verificar autenticación
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Verificar si hay sesión
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          navigate("/login")
          return
        }

        setUser(sessionData.session.user)

        // Obtener rol del usuario
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role_id, user_roles(name)")
          .eq("id", sessionData.session.user.id)
          .single()

        if (profileData?.user_roles?.name) {
          setUserRole(profileData.user_roles.name)
        }
      } catch (error) {
        console.error("Error cargando información del usuario:", error)
        navigate("/login")
      }
    }

    loadUserInfo()
  }, [navigate])

  useEffect(() => {
    // Cargar contrato si estamos editando
    if (id && id !== "nuevo") {
      fetchContract(id)
      setIsEditing(true)
    }
  }, [id])

  const fetchContract = async (contractId) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("contracts").select("*").eq("id", contractId).single()

      if (error) throw error

      if (data) {
        // Mapear los campos de la base de datos al estado del formulario
        setContract({
          fechaSolicitud: data.fecha_solicitud || "",
          centroCostos: data.centro_costos || "",
          secretaria: data.secretaria || "", 
          tipoContrato: data.tipo_contrato || "",
          modalidadSeleccion: data.modalidad_seleccion || "",
          objetoContractual: data.objeto_contractual || "",
          duracionEstimada: data.duracion_estimada || "",
          nombreContratista: data.nombre_contratista || "",
          programa: data.programa || "",
          programa_aprobado: data.programa_aprobado || false,
          indicador: data.indicador || "",
          indicador_aprobado: data.indicador_aprobado || false,
          bpin: data.bpin || "",
          bpin_aprobado: data.bpin_aprobado || false,
          naturalezaGasto: data.naturaleza_gasto || "",
          presupuestoTotal: data.presupuesto_total || "",
          discriminacionRubros: data.discriminacion_rubros || "",
          rubro: data.rubro || "",
          nombreRubro: data.nombre_rubro || "",
          valor: data.valor || "",
          formaPago: data.forma_pago || "",
          nombreSolicitante: data.nombre_solicitante || "",
          cargoSolicitante: data.cargo_solicitante || "",
          firmaSolicitante: data.firma_solicitante || "",
          aprobacionAdministrativa: data.aprobacion_administrativa || "",
          firmaAdministrativa: data.firma_administrativa || "",
          aprobacionHacienda: data.aprobacion_hacienda || "",
          firmaHacienda: data.firma_hacienda || "",
          aprobacionAlcalde: data.aprobacion_alcalde || "",
          firmaAlcalde: data.firma_alcalde || "",
          numeroActa: data.numero_acta || "",
          fechaComite: data.fecha_comite || "",
          observaciones: data.observaciones || "",
          radicado: data.radicado || "",
          current_phase: data.current_phase || 1,
          status: data.status || "en_proceso",
        })
      }
    } catch (error) {
      console.error("Error fetching contract:", error)
      setError("Error al cargar el contrato")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Para checkboxes, usamos el valor de checked
    const newValue = type === "checkbox" ? checked : value

    setContract((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Si el campo que cambió es modalidadSeleccion, actualizar el objeto contractual
    if (name === "modalidadSeleccion" && value !== "") {
      setContract((prev) => ({
        ...prev,
        objetoContractual: textoObjetoContractual,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Mapear los datos del formulario al formato de la base de datos
      const contractData = {
        fecha_solicitud: contract.fechaSolicitud || null, // Usar null si está vacío
        centro_costos: contract.centroCostos,
        tipo_contrato: contract.tipoContrato,
        secretaria: contract.secretaria,
        modalidad_seleccion: contract.modalidadSeleccion,
        objeto_contractual: contract.objetoContractual,
        duracion_estimada: contract.duracionEstimada,
        nombre_contratista: contract.nombreContratista,
        programa: contract.programa,
        programa_aprobado: contract.programa_aprobado || false,
        indicador: contract.indicador,
        indicador_aprobado: contract.indicador_aprobado || false,
        bpin: contract.bpin,
        bpin_aprobado: contract.bpin_aprobado || false,
        naturaleza_gasto: contract.naturalezaGasto,
        presupuesto_total: contract.presupuestoTotal,
        discriminacion_rubros: contract.discriminacionRubros,
        rubro: contract.rubro,
        nombre_rubro: contract.nombreRubro,
        valor: contract.valor,
        forma_pago: contract.formaPago,
        nombre_solicitante: contract.nombreSolicitante,
        cargo_solicitante: contract.cargoSolicitante,
        firma_solicitante: contract.firmaSolicitante,
        aprobacion_administrativa: contract.aprobacionAdministrativa,
        firma_administrativa: contract.firmaAdministrativa,
        aprobacion_hacienda: contract.aprobacionHacienda,
        firma_hacienda: contract.firmaHacienda,
        aprobacion_alcalde: contract.aprobacionAlcalde,
        firma_alcalde: contract.firmaAlcalde,
        numero_acta: contract.numeroActa,
        fecha_comite: contract.fechaComite || null, // Usar null si está vacío
        observaciones: contract.observaciones,
        status: "en_proceso",
        current_phase: 1,
      }

      // Si es revisor y está editando, agregar el radicado y las aprobaciones
      if (userRole === "revisor" && isEditing) {
        contractData.radicado = contract.radicado
        contractData.programa_aprobado = contract.programa_aprobado
        contractData.indicador_aprobado = contract.indicador_aprobado
        contractData.bpin_aprobado = contract.bpin_aprobado

        // Determinar el estado basado en las aprobaciones
        if (contract.programa_aprobado && contract.indicador_aprobado && contract.bpin_aprobado) {
          contractData.status = "aprobado"
          contractData.current_phase = 2 // Avanzar a la siguiente fase
        } else {
          contractData.status = "rechazado"
          contractData.current_phase = 2 // Avanzar a la siguiente fase aunque esté rechazado
        }
      }

      let result

      if (isEditing) {
        // Actualizar contrato existente
        result = await supabase.from("contracts").update(contractData).eq("id", id)

        if (result.error) {
          console.error("Error al actualizar contrato:", result.error)
          throw result.error
        }
      } else {
        // Crear nuevo contrato
        // Obtener el ID del usuario actual
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          throw new Error("No hay sesión activa. Por favor inicie sesión nuevamente.")
        }

        const userId = sessionData.session.user.id

        contractData.created_by = userId
        contractData.current_phase = 1
        contractData.status = "en_proceso"

        result = await supabase.from("contracts").insert(contractData)

        if (result.error) {
          console.error("Error al insertar contrato:", result.error)
          throw result.error
        }
      }

      // Registrar en el historial (solo si no hay error)
      if (!result.error) {
        const historyEntry = {
          contract_id: isEditing ? id : result.data?.[0]?.id,
          user_id: user.id,
          action: isEditing ? "update" : "create",
          phase: isEditing ? contract.current_phase : 1,
          comments: contract.observaciones,
        }

        await supabase.from("contract_history").insert(historyEntry)
      }

      navigate("/dashboard")
    } catch (error) {
      console.error("Error saving contract:", error)
      setError("Error al guardar el contrato: " + (error.message || "Verifique los datos e intente nuevamente"))
    } finally {
      setLoading(false)
    }
  }

  // Modificar la función canEdit para reflejar el flujo correcto
  const canEdit = () => {
    if (!isEditing) return userRole === "solicitante"

    if (userRole === "solicitante") {
      return contract.current_phase === 1
    }

    if (userRole === "revisor") {
      return contract.current_phase === 1 // El revisor puede editar cuando está en fase 1
    }

    return false
  }

  if (loading && !contract) {
    return <div className="container mx-auto p-4">Cargando...</div>
  }

  return (
    <div className="container">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditing ? "Ver/Editar Contrato" : "Nuevo Contrato"}</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Volver
        </button>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="form-header">
        <img src={logoAlcaldia || "/placeholder.svg"} alt="Logo Alcaldía" className="logo" />
        <h2>NECESIDADES DE CONTRATACIÓN</h2>
        <div className="form-id">
          <span>Código: F-GC-01</span>
          <span>Versión: 1.0</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <table className="form-table">
          <tbody>
            <tr>
              <td>
                <div className="form-group">
                  <label htmlFor="fechaSolicitud" className="required">
                    Fecha de solicitud
                  </label>
                  <input
                    type="date"
                    id="fechaSolicitud"
                    name="fechaSolicitud"
                    className="form-control"
                    value={contract.fechaSolicitud}
                    onChange={handleChange}
                    required
                    disabled={!canEdit()}
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label htmlFor="centroCostos" className="required">
                    Centro de Costos
                  </label>
                  <select
                    id="centroCostos"
                    name="centroCostos"
                    className="form-control"
                    value={contract.centroCostos}
                    onChange={handleChange}
                    required
                    disabled={!canEdit()}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="01001">01001 CONCEJO</option>
                    <option value="02001">02001 PERSONERIA</option>
                    <option value="03001">03001 JURIDICA</option>
                    <option value="04001">04001 ALCALDÍA</option>
                    <option value="05001">05001 EDUCACIÓN</option>
                    <option value="05002">05002 BIBLIOTECA MUNICIPAL</option>
                    <option value="06001">06001 GOBIERNO</option>
                    <option value="06002">06002 INSPECCIÓN 1ra POLICIA</option>
                    <option value="06006">06006 INSPECCIÓN 2da DE POLICIA</option>
                    <option value="06007">06007 INSPECCIÓN 3ra INFRACCIONES URBANISTICAS</option>
                    <option value="06008">06008 INSPECCIÓN 4ta AFECTACIONES AMBIENTALES</option>
                    <option value="06003">06003 COMISARIA DE FAMILIA NORTE</option>
                    <option value="06009">06009 COMISARIA DE FAMILIA SUR</option>
                    <option value="06004">06004 FONSET</option>
                    <option value="06005">06005 GESTIÓN DEL RIESGO</option>
                    <option value="07001">07001 DESARROLLO Y BIENESTAR SOCIAL</option>
                    <option value="07002">07002 VICTIMAS DE CONFLICTO</option>
                    <option value="07003">07003 TURISMO</option>
                    <option value="07004">07004 JUVENTUD </option>
                    <option value="07005">07005 HABITANTE DE CALLE</option>
                    <option value="08001">08001 PLANEACIÓN</option>
                    <option value="08002">08002 SISBEN</option>
                    <option value="08003">08003 CALIDAD</option>
                    <option value="09001">09001 INFRAESTRUCTURA</option>
                    <option value="10001">10001 HACIENDA</option>
                    <option value="10002">10002 CATASTRO</option>
                    <option value="11001">11001 SERVICIOS ADMINISTRATIVOS</option>
                    <option value="11002">11002 PERSONAL</option>
                    <option value="11003">11003 ALMACEN</option>
                    <option value="11004">11004 ARCHIVO</option>
                    <option value="12001">12001 SALUD</option>
                    <option value="12002">12002 ADULTO MAYOR</option>
                    <option value="12003">12003 SANEAMIENTO</option>
                    <option value="12004">12004 PLAN ALIMENTARIO ESCOLAR</option>
                    <option value="14001">14001 CULTURA</option>
                    <option value="15001">15001 MOVILIDAD</option>
                    <option value="16001">16001 INVICOP</option>
                    <option value="17001">17001 JUNTA DE DEPORTES</option>
                    <option value="18001">18001 AGRICULTURA Y MEDIO AMBIENTE</option>
                    <option value="18002">18002 ALBERGUE</option>
                    <option value="20001">20001 CONTROL INTERNO</option>
                    <option value="21001">21001 COMUNICACIONES</option>
                    <option value="22001">22001 CONTROL DISCIPLINARIO</option>
                    <option value="23001">23001 DIRECCIÓN FINANCIERA</option>
                    <option value="23002">23002 COBRO COACTIVO</option>
                  </select>
                </div>
              </td>
              <td>
                {/* Nuevo campo de secretaría */}
                <div className="form-group">
                  <label htmlFor="secretaria" className="required">
                    Secretaría
                  </label>
                  <select
                    id="secretaria"
                    name="secretaria"
                    className="form-control"
                    value={contract.secretaria}
                    onChange={handleChange}
                    required
                    disabled={!canEdit()}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Departamento Administrativo de Planeación">
                      Departamento Administrativo de Planeación
                    </option>
                    <option value="Secretaría de Salud">Secretaría de Salud</option>
                    <option value="Secretaría de Agricultura y Medio Ambiente">
                      Secretaría de Agricultura y Medio Ambiente
                    </option>
                    <option value="Secretaría de Gobierno">Secretaría de Gobierno</option>
                    <option value="Secretaría de Servicios Administrativos">
                      Secretaría de Servicios Administrativos
                    </option>
                    <option value="Oficina de Comunicaciones">Oficina de Comunicaciones</option>
                    <option value="Secretaría de Movilidad">Secretaría de Movilidad</option>
                    <option value="Secretaría de Hacienda">Secretaría de Hacienda</option>
                    <option value="Secretaría de Infraestructura">Secretaría de Infraestructura</option>
                    <option value="Secretaría de Educación y Cultura">Secretaría de Educación y Cultura</option>
                    <option value="Secretaría de Desarrollo y Bienestar Social">
                      Secretaría de Desarrollo y Bienestar Social
                    </option>
                    <option value="Invicop">Invicop</option>
                    <option value="Inder Copacabana">Inder Copacabana</option>
                    <option value="Oficina Juridica">Oficina Juridica</option>
                    <option value="Dirección técnica control interno">Dirección técnica control interno</option>
                  </select>
                </div>
              </td>
              <td>
                {/* Campo de radicado - solo visible para revisor */}
                {(userRole === "revisor" || (isEditing && contract.radicado)) && (
                  <div className="form-group">
                    <label htmlFor="radicado" className="block text-sm font-medium text-gray-700">
                      Número de Radicado {userRole === "revisor" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      id="radicado"
                      name="radicado"
                      value={contract.radicado}
                      onChange={handleChange}
                      required={userRole === "revisor"}
                      disabled={userRole !== "revisor" || !canEdit()}
                      className="form-control"
                    />
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Sección: Información Jurídica */}
        <div className="form-section">
          <h3 className="form-section-title">Información Jurídica</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="tipoContrato" className="required">
                      Tipo de contrato
                    </label>
                    <select
                      id="tipoContrato"
                      name="tipoContrato"
                      className="form-control"
                      value={contract.tipoContrato}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1-prestaciondeservicios">
                        1-Prestación de servicios persona natural o jurídica
                      </option>
                      <option value="2-suministros">2-Suministro</option>
                      <option value="3-compraventa">3-Compraventa</option>
                      <option value="4-arrendamiento">4-Arrendamiento</option>
                      <option value="5-obra">5-Obra</option>
                      <option value="6-comodato">6-Comodato</option>
                      <option value="7-iteradministrativo">7-Interadministrativo</option>
                      <option value="8-concesion">8-Concesión</option>
                      <option value="9-mandato">9-Mandato</option>
                      <option value="10-leasing">10-Leasing</option>
                      <option value="11-fiducia">11-Fiducia</option>
                      <option value="12-consultoria">12-Consultoría</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="modalidadSeleccion" className="required">
                      Modalidad de selección
                    </label>
                    <select
                      id="modalidadSeleccion"
                      name="modalidadSeleccion"
                      className="form-control"
                      value={contract.modalidadSeleccion}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="CCE-01">CCE-01 Solicitud de información a los Proveedores</option>
                      <option value="CCE-02">CCE-02 Licitación pública</option>
                      <option value="CCE-17">CCE-17 Licitación pública (Obra pública)</option>
                      <option value="CCE-03">CCE-03 Concurso de méritos con precalificación</option>
                      <option value="CCE-04">CCE-04 Concurso de méritos abierto</option>
                      <option value="CCE-05">CCE-05 Contratación directa (con ofertas) </option>
                      <option value="CCE-06">CCE-06 Selección abreviada menor cuantía</option>
                      <option value="CCE-18-">
                        CCE-18-Seleccion_Abreviada_Menor_Cuantia_Sin_Manifestacion_Interes Selección Abreviada de Menor
                        Cuantia sin Manifestacion de Interés
                      </option>
                      <option value="CCE-07">CCE-07 Selección abreviada subasta inversa</option>
                      <option value="CCE-10">CCE-10 Mínima cuantía</option>
                      <option value="CCE-11||01">
                        CCE-11||01 Contratación régimen especial - Selección de comisionista
                      </option>
                      <option value="CCE-11||02">
                        CCE-11||02 Contratación régimen especial - Enajenación de bienes para intermediarios idóneos
                      </option>
                      <option value="CCE-11||03">CCE-11||03 Contratación régimen especial - Régimen especial</option>
                      <option value="CCE-11||04">
                        CCE-11||04 Contratación régimen especial - Banco multilateral y organismos multilaterales
                      </option>
                      <option value="CCE-15||01">
                        CCE-15||01 Contratación régimen especial (con ofertas) - Selección de comisionista
                      </option>
                      <option value="CCE-15||02">
                        CCE-15||02 Contratación régimen especial (con ofertas) - Enajenación de bienes para
                        intermediarios idóneos
                      </option>
                      <option value="CCE-15||03">
                        CCE-15||03 Contratación régimen especial (con ofertas) - Régimen especial
                      </option>
                      <option value="CCE-15||04">
                        CCE-15||04 Contratación régimen especial (con ofertas) - Banco multilateral y organismos
                        multilaterales
                      </option>
                      <option value="CCE-16">CCE-16 Contratación directa.</option>
                      <option value="CCE-99">CCE-99 Seléccion abreviada - acuerdo marco</option>
                    </select>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className="form-group">
                    <label htmlFor="objetoContractual" className="required">
                      Objeto contractual
                    </label>
                    <textarea
                      id="objetoContractual"
                      name="objetoContractual"
                      className="form-control"
                      placeholder="Describe el contrato aquí..."
                      value={contract.objetoContractual}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="duracionEstimada">Duración estimada</label>
                    <input
                      type="text"
                      id="duracionEstimada"
                      name="duracionEstimada"
                      className="form-control"
                      placeholder="meses, días, temporal, definido o Indefinido"
                      value={contract.duracionEstimada}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="nombreContratista">Nombre Contratista</label>
                    <input
                      type="text"
                      id="nombreContratista"
                      name="nombreContratista"
                      className="form-control"
                      placeholder="Ingrese Nombre Completo"
                      value={contract.nombreContratista}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Información Plan de Desarrollo Municipal */}
        <div className="form-section">
          <h3 className="form-section-title">Información Plan de Desarrollo Municipal</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="programa">Programa</label>
                    <select
                      id="programa"
                      name="programa"
                      className="form-control"
                      value={contract.programa}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      {opcionesProgramas.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>

                    {/* Checkbox de aprobación - solo visible para revisor */}
                    {userRole === "revisor" && isEditing && (
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="programa_aprobado"
                            checked={contract.programa_aprobado}
                            onChange={handleChange}
                            disabled={!canEdit()}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Aprobado</span>
                        </label>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="indicador">Indicador</label>
                    <select
                      id="indicador"
                      name="indicador"
                      className="form-control"
                      value={contract.indicador}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      {opcionesIndicadores.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>

                    {/* Checkbox de aprobación - solo visible para revisor */}
                    {userRole === "revisor" && isEditing && (
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="indicador_aprobado"
                            checked={contract.indicador_aprobado}
                            onChange={handleChange}
                            disabled={!canEdit()}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Aprobado</span>
                        </label>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className="form-group">
                    <label htmlFor="bpin">BPIN</label>
                    <select
                      id="bpin"
                      name="bpin"
                      className="form-control"
                      value={contract.bpin}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      {opcionesBPIN.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>

                    {/* Checkbox de aprobación - solo visible para revisor */}
                    {userRole === "revisor" && isEditing && (
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="bpin_aprobado"
                            checked={contract.bpin_aprobado}
                            onChange={handleChange}
                            disabled={!canEdit()}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Aprobado</span>
                        </label>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Información Presupuestal */}
        <div className="form-section">
          <h3 className="form-section-title">Información Presupuestal</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="naturalezaGasto">Naturaleza del gasto</label>
                    <textarea
                      id="naturalezaGasto"
                      name="naturalezaGasto"
                      className="form-control"
                      placeholder="Describe aquí..."
                      value={contract.naturalezaGasto}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="presupuestoTotal" className="required">
                      Presupuesto Total
                    </label>
                    <input
                      type="number"
                      id="presupuestoTotal"
                      name="presupuestoTotal"
                      className="form-control"
                      placeholder="Ingrese el presupuesto"
                      value={contract.presupuestoTotal}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Discriminación de Rubros presupuestales */}
        <div className="form-section">
          <h3 className="form-section-title">Discriminación de Rubros presupuestales</h3>
          <table className="form-table">
            <thead>
              <tr>
                <th>Resumido</th>
                <th>Rubro</th>
                <th>Nombre rubro</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <textarea
                    name="discriminacionRubros"
                    className="form-control"
                    placeholder="Describe aquí..."
                    value={contract.discriminacionRubros}
                    onChange={handleChange}
                    disabled={!canEdit()}
                  />
                </td>
                <td>
                  <textarea
                    name="rubro"
                    className="form-control"
                    placeholder="Describe aquí..."
                    value={contract.rubro}
                    onChange={handleChange}
                    disabled={!canEdit()}
                  />
                </td>
                <td>
                  <textarea
                    name="nombreRubro"
                    className="form-control"
                    placeholder="Describe aquí..."
                    value={contract.nombreRubro}
                    onChange={handleChange}
                    disabled={!canEdit()}
                  />
                </td>
                <td>
                  <textarea
                    name="valor"
                    className="form-control"
                    placeholder="Describe aquí..."
                    value={contract.valor}
                    onChange={handleChange}
                    disabled={!canEdit()}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label htmlFor="formaPago" className="required">
              Forma de pago
            </label>
            <select
              id="formaPago"
              name="formaPago"
              className="form-control"
              value={contract.formaPago}
              onChange={handleChange}
              required
              disabled={!canEdit()}
            >
              <option value="">Seleccionar...</option>
              <option value="unico_pago">Único Pago</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>
        </div>

        {/* Sección: Datos del Solicitante */}
        <div className="form-section">
          <h3 className="form-section-title">Datos del Solicitante</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="nombreSolicitante" className="required">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombreSolicitante"
                      name="nombreSolicitante"
                      className="form-control"
                      placeholder="Ingrese su nombre"
                      value={contract.nombreSolicitante}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="cargoSolicitante" className="required">
                      Cargo
                    </label>
                    <input
                      type="text"
                      id="cargoSolicitante"
                      name="cargoSolicitante"
                      className="form-control"
                      placeholder="Ingrese su cargo"
                      value={contract.cargoSolicitante}
                      onChange={handleChange}
                      required
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="firmaSolicitante">Firma</label>
                    <input
                      type="text"
                      id="firmaSolicitante"
                      name="firmaSolicitante"
                      className="form-control"
                      placeholder="Ingrese su firma"
                      value={contract.firmaSolicitante}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Aprobaciones */}
        <div className="form-section">
          <h3 className="form-section-title">Aprobaciones</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="approval-section">
                    <label htmlFor="aprobacionAdministrativa">Departamento Administrativo</label>
                    <select
                      id="aprobacionAdministrativa"
                      name="aprobacionAdministrativa"
                      className="form-control"
                      value={contract.aprobacionAdministrativa}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                    <input
                      type="text"
                      name="firmaAdministrativa"
                      className="form-control"
                      placeholder="Firma"
                      value={contract.firmaAdministrativa}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="approval-section">
                    <label htmlFor="aprobacionHacienda">Secretaría de Hacienda</label>
                    <select
                      id="aprobacionHacienda"
                      name="aprobacionHacienda"
                      className="form-control"
                      value={contract.aprobacionHacienda}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                    <input
                      type="text"
                      name="firmaHacienda"
                      className="form-control"
                      placeholder="Firma"
                      value={contract.firmaHacienda}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="approval-section">
                    <label htmlFor="aprobacionAlcalde">Alcalde Municipal</label>
                    <select
                      id="aprobacionAlcalde"
                      name="aprobacionAlcalde"
                      className="form-control"
                      value={contract.aprobacionAlcalde}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="rechazado">Rechazado</option>
                    </select>
                    <input
                      type="text"
                      name="firmaAlcalde"
                      className="form-control"
                      placeholder="Firma"
                      value={contract.firmaAlcalde}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Información del Comité */}
        <div className="form-section">
          <h3 className="form-section-title">Información del Comité de Contratación</h3>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  <div className="form-group">
                    <label htmlFor="numeroActa">Número de Acta</label>
                    <input
                      type="text"
                      id="numeroActa"
                      name="numeroActa"
                      className="form-control"
                      placeholder="Ingrese el número de acta"
                      value={contract.numeroActa}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-group">
                    <label htmlFor="fechaComite">Fecha del Comité</label>
                    <input
                      type="date"
                      id="fechaComite"
                      name="fechaComite"
                      className="form-control"
                      value={contract.fechaComite}
                      onChange={handleChange}
                      disabled={!canEdit()}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección: Observaciones */}
        <div className="form-section">
          <h3 className="form-section-title">Observaciones</h3>
          <textarea
            name="observaciones"
            className="form-control"
            placeholder="Ingrese observaciones adicionales..."
            value={contract.observaciones}
            onChange={handleChange}
            rows="4"
            disabled={!canEdit()}
          />
        </div>

        {/* Botones de acción */}
        {canEdit() && (
          <div className="form-actions">
            <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </form>

      <div className="form-footer">
        <p>Página 1 de 1 • Oficina Jurídica</p>
      </div>
    </div>
  )
}
