import React, { Component } from "react";
import axios from "axios";
import Global from "../Global";
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { BsPencilSquare, BsTrash,BsPlus } from "react-icons/bs";
import { Modal, Form } from "react-bootstrap"; 
import Swal from 'sweetalert';
import { Navigate } from "react-router-dom";
import './estilos.css';

export default class Contactos extends Component {
    state = {
        contactos: [],
        idU: null,
        nombreU: null,
        status: null,
        nuevoContacto:{
            nombre: "",
            id_usuario: "",
            correo: "",
            telefono: ""
        },
        showCreateModal: false,
        showUpdateModal: false,
        identidicadorActualizar: null,
        contactoActualizar:null,
        redirectToUsuarios: false
    };

    cargarId = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        if (idUsuario) {
            this.setState({ idU: idUsuario, nombreU: nombreUsuario });
        }
    }

    // Función para cargar los contactos
    cargarContactos = () => {
        const { idU } = this.state;
        if (idU) {
            var request = Global.url + "/usuarios/contactos/" + idU;
            console.log(request);
            axios.get(request).then(res => {
                this.setState({
                    contactos: res.data,
                    status: "success"
                });
            }).catch(error => {
                console.error("Error al cargar, no hay contactos:", error);
            });
        }
    };

    componentDidMount() {
        this.cargarId();
        this.cargarContactos();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.idU !== prevState.idU) {
            this.cargarContactos();
        }
    }

    eliminarContacto = (id) => {
        var request = Global.url + "/usuarios/contactos/delete/" + id;
        axios.delete(request).then(res => {
            this.setState({
                status: "success"
            });
            this.cargarContactos();
        }).catch(error => {
            console.error("Error al eliminar contacto:", error);
        });
    }

    abrirModalCrear = () => {
        this.setState({ showCreateModal: true });
    }

    cerrarModalCrear = () => {
        this.setState({  showCreateModal: false });
    }

    // Función para manejar el cambio de input en el formulario del modal
     handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            nuevoContacto: {
                ...prevState.nuevoContacto,
                [name]: value
            }
        }));
    };

     // Función para manejar el envío del formulario del modal
     handleSubmit = (e) => {
        e.preventDefault();
        const { nombre, telefono, correo } = this.state.nuevoContacto;
        if (!nombre || !telefono || !correo) {
            Swal({
                title: "Error",
                text: "Por favor, complete todos los campos.",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }
        var contacto = {
            nombre: nombre,
            telefono: telefono,
            correo: correo,
            id_usuario: this.state.idU
        };
        var request = Global.url + "/usuarios/contactos/create";
        axios.post(request,contacto).then(res => {
            this.setState({
                status: "success",
                nuevoContacto: {
                    nombre: "",
                    edad: "",
                    direccion: "",
                    telefono: "",
                    correo: ""
                }
            });
            this.cargarContactos();
        });
        this.cerrarModalCrear();
    };

    abrirModalActualizar = (id,contacto) => {
        this.setState({ showUpdateModal: true, identidicadorActualizar: id, contactoActualizar: contacto});
    }

    cerrarModalActualizar = () => {
        this.setState({ showUpdateModal: false });
    }

    handleChangeActualizar = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            contactoActualizar: {
                ...prevState.contactoActualizar,
                [name]: value
            }
        }));
    } 

    actualizarContacto = (id) => {
        const { contactoActualizar } = this.state;
        if (!contactoActualizar) {
            //mostrar mensaje
            return;
        }

        const { nombre, telefono, correo } = this.state.contactoActualizar;
        if (!nombre || !telefono || !correo) {
            Swal({
                title: "Error",
                text: "Por favor, complete todos los campos.",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }
        var contacto = {
            nombre: nombre,
            telefono: telefono,
            correo: correo
        };
        var request = Global.url + "/usuarios/contactos/update/" + id;
        axios.put(request,contacto).then(res => {
            this.setState({
                status: "success",
                contactoActualizar: {
                    nombre: "",
                    telefono: "",
                    correo: ""
                },
                identidicadorActualizar: null
            });
            this.cargarContactos();
        });
        this.cerrarModalActualizar();
    }

    redireccionarAUsuarios = () => {
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('nombreUsuario');
        this.setState({ redirectToUsuarios: true });
    }


    render() {
        if (this.state.redirectToUsuarios) {
            return <Navigate to="/usuarios" />;
        }
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h1 className="mt-4 mb-4">Contactos de {this.state.nombreU}</h1>
                        <div className="d-flex justify-content-end" onClick={this.redireccionarAUsuarios}>
                            <Button variant="secondary">
                                Regresar a Usuarios
                            </Button>
                        </div>
                        <Button variant="primary" className="mb-3"  onClick={this.abrirModalCrear}>
                            <BsPlus className="mr-2" />Nuevo contacto
                        </Button> 
                        <Table striped bordered hover responsive className="shadow-sm">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.contactos.map((contacto) => (
                                    <tr key={contacto.id}>
                                        <td>{contacto.nombre}</td>
                                        <td>{contacto.correo}</td>
                                        <td>{contacto.telefono}</td>
                                        <td className="text-center">
                                            <Button variant="info" className="mr-2 mb-2" onClick={() => this.abrirModalActualizar(contacto.id,contacto)}>
                                                <BsPencilSquare /> Actualizar
                                            </Button>
                                            <Button variant="danger" onClick={() => this.eliminarContacto(contacto.id)}>
                                                <BsTrash /> Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal show={this.state.showCreateModal} onHide={this.cerrarModalCrear}>
                            <Modal.Header closeButton>
                                <Modal.Title>Crear contacto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="formNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese nombre"
                                            name="nombre"
                                            value={this.state.nuevoContacto.nombre}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formTelefono">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese Telefono"
                                            name="telefono"
                                            value={this.state.nuevoContacto.direccion}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formCorreo">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese Correo"
                                            name="correo"
                                            value={this.state.nuevoContacto.correo}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mr-2">
                                        Guardar
                                    </Button>
                                    <Button variant="secondary" onClick={this.cerrarModalCrear} className="ml-2">
                                        Cancelar
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>

                        {/* Modal para actualizar un usuario*/}
                        <Modal show={this.state.showUpdateModal} onHide={this.cerrarModalActualizar}>
                            <Modal.Header closeButton>
                                <Modal.Title>Actualizar contacto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={(e) => this.actualizarContacto(this.state.identidicadorActualizar, e)}>
                                    <Form.Group controlId="formNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese nombre"
                                            name="nombre"
                                            value={this.state.contactoActualizar ? this.state.contactoActualizar.nombre : ''}
                                            onChange={this.handleChangeActualizar}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formTelefono">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese Telefono"
                                            name="telefono"
                                            value={this.state.contactoActualizar ? this.state.contactoActualizar.telefono : ''}
                                            onChange={this.handleChangeActualizar}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formCorreo">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese Correo"
                                            name="correo"
                                            value={this.state.contactoActualizar ? this.state.contactoActualizar.correo : ''}
                                            onChange={this.handleChangeActualizar}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mr-2">
                                        Guardar cambios
                                    </Button>
                                    <Button variant="secondary" onClick={this.cerrarModalActualizar} className="ml-2">
                                        Cancelar
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
            </Container>
        );
    }
}
