import React, { Component } from "react";
import axios from "axios";
import Global from "../Global";
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPlus, BsPencilSquare, BsTrash,BsBook} from "react-icons/bs"; 
import { Modal, Form } from "react-bootstrap"; 
import Swal from 'sweetalert';
import { Navigate } from "react-router-dom";
import './estilos.css';

export default class Usuarios extends Component {
    state = {
        usuarios: [],
        status: null,
        showCreateModal: false,
        showUpdateModal: false,
        nuevoUsuario: {
            nombre: "",
            edad: "",
            direccion: "",
            telefono: "",
            correo: ""
        },
        usuarioSeleccionado: null,
        id: null,
        redirectToContactos: false 
    };

    // Función para cargar los usuarios
    cargarUsuarios = () => {
        var request = Global.url + "/usuarios";
        axios.get(request).then(res => {
            this.setState({
                usuarios: res.data,
                status: "success"
            });
        });
    };

    componentDidMount() {
        this.cargarUsuarios();
    }

    
    // Función para abrir el modal de crear usuario
    abrirModal = () => {
        this.setState({  showCreateModal: true});
    };

    //funcion para abrir el modal de actualizar usuario
    abrirModalActualizar = (usuario,identificador) => {
        this.setState({ showUpdateModal: true,
            usuarioSeleccionado: usuario,
            id: identificador
        });
    };

    // Función para cerrar el modal actualizar
    cerrarModalActualizar = () => {
        this.setState({  showUpdateModal: false });
    };

    // Función para cerrar el modal
    cerrarModal = () => {
        this.setState({  showCreateModal: false });
    };

    // Función para manejar el cambio de input en el formulario del modal
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            nuevoUsuario: {
                ...prevState.nuevoUsuario,
                [name]: value
            }
        }));
    };

    handleChangeActualizar = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            usuarioSeleccionado: {
                ...prevState.usuarioSeleccionado,
                [name]: value
            }
        }));
    };

    // Función para manejar el envío del formulario del modal
    handleSubmit = (e) => {
        e.preventDefault();
        const { nombre, edad, direccion, telefono, correo } = this.state.nuevoUsuario;
        if (!nombre || !edad || !direccion || !telefono || !correo) {
            Swal({
                title: "Error",
                text: "Por favor, complete todos los campos.",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }
        var usuario = {
            nombre: nombre,
            edad: edad,
            direccion: direccion,
            telefono: telefono,
            correo: correo
        };
        var request = Global.url + "/usuarios/create";
        axios.post(request,usuario).then(res => {
            this.setState({
                status: "success",
                nuevoUsuario: {
                    nombre: "",
                    edad: "",
                    direccion: "",
                    telefono: "",
                    correo: ""
                }
            });
            this.cargarUsuarios();
        });
        this.cerrarModal();
    };

    //funcion para eliminar un usuario
    eliminarUsuario = (id) => {
        var request = Global.url + "/usuarios/delete/" + id;
        axios.delete(request).then(res => {
            this.setState({
                status: "success"
            });
            this.cargarUsuarios();
        });
    };

    //funcion para actualizar un usuario
    actualizarUsuario = (id) => {
        const { usuarioSeleccionado } = this.state;
        if (!usuarioSeleccionado) {
            // Mostrar mensaje de error o manejar la situación de usuarioSeleccionado siendo null
            return;
        }
    
        const { nombre, edad, direccion, telefono, correo } = usuarioSeleccionado;
        if (!nombre || !edad || !direccion || !telefono || !correo) {
            Swal({
                title: "Error",
                text: "Por favor, complete todos los campos.",
                icon: "error",
                button: "Aceptar"
            });
            return;
        }
    
        var usuario = {
            nombre: nombre,
            edad: edad,
            direccion: direccion,
            telefono: telefono,
            correo: correo
        };
    
        var request = Global.url + "/usuarios/update/" + id;
        axios.put(request, usuario).then(res => {
            this.setState({
                status: "success",
                usuarioSeleccionado: null,
                id: null
            });
            this.cargarUsuarios();
        });
        this.cerrarModal();
    };

    //funcion para redoerigir a la pagina de contactos
    redireccionarContactos = (id,nombre) => {
        localStorage.setItem("idUsuario", id);
        localStorage.setItem("nombreUsuario", nombre);
        this.setState({ redirectToContactos: true }); 
    };

    render() {
        if (this.state.redirectToContactos) {
            return <Navigate to="/usuarios/contactos" />;
        }
        return (
            <div className="container mt-5">
                <h1 className="mb-4">Usuarios</h1>
                <Button variant="primary" className="mb-3"  onClick={this.abrirModal}>
                    <BsPlus className="mr-2" />Crear usuario
                </Button> 
                <Table striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Correo</th>
                            <th>Acciones</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.edad}</td>
                                <td>{usuario.direccion}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.correo}</td>
                                <td>
                                    <Button variant="info" className="mr-2"  onClick={() => this.abrirModalActualizar(usuario, usuario.id)}>
                                        <BsPencilSquare /> Actualizar
                                    </Button> 
                                    <Button variant="danger" onClick={() => this.eliminarUsuario(usuario.id)}>
                                        <BsTrash /> Eliminar
                                    </Button>
                                    <Button variant="info"  onClick={() => this.redireccionarContactos(usuario.id,usuario.nombre)}>
                                       <BsBook/> Contactos
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal para crear un usuario */}
                <Modal show={this.state.showCreateModal} onHide={this.cerrarModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    name="nombre"
                                    value={this.state.nuevoUsuario.nombre}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEdad">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese edad"
                                    name="edad"
                                    value={this.state.nuevoUsuario.edad}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDireccion">
                                <Form.Label>Direccion</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Direccion"
                                    name="direccion"
                                    value={this.state.nuevoUsuario.direccion}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTelefono">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Telefono"
                                    name="telefono"
                                    value={this.state.nuevoUsuario.telefono}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCorreo">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Correo"
                                    name="correo"
                                    value={this.state.nuevoUsuario.correo}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mr-2">
                                Guardar
                            </Button>
                            <Button variant="secondary" onClick={this.cerrarModal} className="ml-2">
                                Cancelar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Fin del modal */}

                 {/* Modal para actualizar un usuario*/}
                 <Modal show={this.state.showUpdateModal} onHide={this.cerrarModalActualizar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => this.actualizarUsuario(this.state.id, e)}>
                            <Form.Group controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    name="nombre"
                                    value={this.state.usuarioSeleccionado ? this.state.usuarioSeleccionado.nombre : ''}
                                    onChange={this.handleChangeActualizar}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEdad">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese edad"
                                    name="edad"
                                    value={this.state.usuarioSeleccionado ? this.state.usuarioSeleccionado.edad : ''}
                                    onChange={this.handleChangeActualizar}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDireccion">
                                <Form.Label>Direccion</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Direccion"
                                    name="direccion"
                                    value={this.state.usuarioSeleccionado ? this.state.usuarioSeleccionado.direccion : ''}
                                    onChange={this.handleChangeActualizar}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTelefono">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Telefono"
                                    name="telefono"
                                    value={this.state.usuarioSeleccionado ? this.state.usuarioSeleccionado.telefono : ''}
                                    onChange={this.handleChangeActualizar}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCorreo">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese Correo"
                                    name="correo"
                                    value={this.state.usuarioSeleccionado ? this.state.usuarioSeleccionado.correo : ''}
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
            </div>
        );
    }
}
