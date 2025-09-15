import { useRef, useState, Fragment } from "react"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { SelectButton } from "primereact/selectbutton"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Checkbox } from "primereact/checkbox"
import Swal from "sweetalert2"

const opcionesColor = [
  { label: "Rojo", value: "red" },
  { label: "Amarillo", value: "yellow" },
  { label: "Verde", value: "green" }
]

const Tarjeta = () => {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [color, setColor] = useState("")
  const [acepta, setAcepta] = useState(false)
  const [errors, setErrors] = useState({ nombre: "", email: "" })
  const toast = useRef(null)

  const validarNombre = value => {
    if (!value || value.trim() === "") return "El nombre no puede estar vacío"
    return ""
  }

  const validarEmail = value => {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value || value.trim() === "") return "El email no puede estar vacío"
    if (!expresion.test(value)) return "Ingrese un email válido (ej: ejemplo@correo.com)"
    return ""
  }

  const onChangeNombre = e => {
    const v = e.target.value
    setNombre(v)
    setErrors(prev => ({ ...prev, nombre: validarNombre(v) }))
  }

  const onChangeEmail = e => {
    const v = e.target.value
    setEmail(v)
    setErrors(prev => ({ ...prev, email: validarEmail(v) }))
  }

  const guardarEnLocalStorage = persona => {
    const existente = localStorage.getItem("personas")
    const lista = existente ? JSON.parse(existente) : []
    lista.push(persona)
    localStorage.setItem("personas", JSON.stringify(lista))
  }

  const confirmarFormulario = () => {
    const errNombre = validarNombre(nombre)
    const errEmail = validarEmail(email)
    setErrors({ nombre: errNombre, email: errEmail })

    if (errNombre || errEmail || !color || !acepta) {
      Swal.fire({
        icon: "error",
        title: "Formulario incompleto",
        text: "Por favor completa todos los campos obligatorios y acepta los términos"
      })
      return
    }

    Swal.fire({
      title: "¿Desea confirmar los datos?",
      html: `Nombre: ${nombre}<br/>Email: ${email}<br/>Color: ${opcionesColor.find(c => c.value === color)?.label || ""}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        guardarEnLocalStorage({
          nombre,
          email,
          color,
          acepta,
          createdAt: new Date().toISOString()
        })
        toast.current?.show({
          severity: "success",
          summary: "Guardado",
          detail: "Persona guardada",
          life: 3000
        })
        limpiar()
      }
    })
  }

  const limpiar = () => {
    setNombre("")
    setEmail("")
    setColor("")
    setAcepta(false)
    setErrors({ nombre: "", email: "" })
  }

  const formularioValido =
    !validarNombre(nombre) &&
    !validarEmail(email) &&
    color &&
    acepta

  const colorTemplate = option => {
    return (
      <div
        style={{
          backgroundColor: option.value,
          color: option.value === "yellow" ? "black" : "white",
          padding: "6px 12px",
          borderRadius: 6,
          textAlign: "center",
          width: "80px"
        }}
      >
        {option.label}
      </div>
    )
  }

  return (
    <Fragment>
      <Toast ref={toast} position="top-right"/>
      <Card title="Tarjeta de Usuario">
        <div className="p-fluid" style={{ display: "grid", gap: "1rem" }}>
          <span className="p-float-label">
            <InputText id="nombre" value={nombre} onChange={onChangeNombre} />
            <label htmlFor="nombre">Nombre</label>
          </span>
          {errors.nombre && <small className="p-error">{errors.nombre}</small>}

          <span className="p-float-label">
            <InputText id="email" value={email} onChange={onChangeEmail} />
            <label htmlFor="email">Email</label>
          </span>
          {errors.email && <small className="p-error">{errors.email}</small>}

          <div>
            <small>Color favorito</small>
            <div style={{ marginTop: 8 }}>
              <SelectButton
                value={color}
                options={opcionesColor}
                onChange={e => setColor(e.value)}
                itemTemplate={colorTemplate}
              />
            </div>
          </div>

          <div>
            <Checkbox inputId="acepta" checked={acepta} onChange={e => setAcepta(e.checked)} />
            <label htmlFor="acepta" style={{ marginLeft: 8 }}>
              Acepto términos y condiciones
            </label>
          </div>

          <div
            style={{
              backgroundColor: color || "transparent",
              borderRadius: 12,
              padding: 16,
              color: color === "yellow" ? "black" : "white"
            }}
          >
            <h2>Nombre: {nombre || "_______"}</h2>
            <p>Contacto: {email || "_______"}</p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button label="Guardar" icon="pi pi-check" severity="success" onClick={confirmarFormulario} disabled={!formularioValido} />
            <Button label="Limpiar" icon="pi pi-eraser" severity="secondary" onClick={limpiar} />
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default Tarjeta
