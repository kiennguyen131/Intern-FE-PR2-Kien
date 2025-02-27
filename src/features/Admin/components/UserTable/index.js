import React, { useEffect, useState, useRef } from "react"
import { Table, Button, Input, Modal, ModalBody, ModalFooter } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"
import {
  usersSelector,
  getUsers,
  paramsSelector,
  deleteUser,
  changeParams,
  changeUser
} from "./../../../../app/adminSlice"

function UserTable({ setOpenForm }) {
  const dispatch = useDispatch()
  const [modal, setModal] = useState({
    open: false,
    id: ""
  })
  const params = useSelector(paramsSelector)
  const { _limit, _page } = params
  const users = useSelector(usersSelector)

  const [data, setData] = useState({
    fullName: "",
    email: "",
    gender: ""
  })

  const typingTimeoutReft = useRef(null)

  const onHandleInputChange = e => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value
    })

    const newFilterParams = { ...params }
    value === ""
      ? name === "gender"
        ? delete newFilterParams[`${name}`]
        : delete newFilterParams[`${name}_like`]
      : name === "gender"
      ? (newFilterParams[`${name}`] = value)
      : (newFilterParams[`${name}_like`] = value)

    if (typingTimeoutReft.current) {
      clearTimeout(typingTimeoutReft.current)
    }

    typingTimeoutReft.current = setTimeout(() => {
      dispatch(changeParams({ ...newFilterParams, _page: 1 }))
    }, 300)
  }

  useEffect(() => {
    dispatch(getUsers(params))
    return dispatch(changeUser(""))
  }, [dispatch, params])

  const onHandleClearFilter = () => {
    setData({
      fullName: "",
      email: "",
      gender: ""
    })
    dispatch(changeParams({ _page: 1, _limit: 10 }))
  }

  const onHandleDelete = id => {
    setModal({
      open: true,
      id: id
    })
  }

  const onAcceptDelete = () => {
    dispatch(deleteUser(modal.id))
    setModal({ ...modal, open: false })
  }

  const onHandleEdit = user => {
    setOpenForm(true)
    dispatch(changeUser(user))
  }

  return (
    <Table striped>
      <thead>
        <tr className="text-center">
          <th>#</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th></th>
          <td>
            <Input
              autoComplete="false"
              name="fullName"
              onChange={e => onHandleInputChange(e)}
              placeholder="Search full name"
              value={data.fullName}
            />
          </td>
          <td>
            <Input
              autoComplete="false"
              name="email"
              onChange={e => onHandleInputChange(e)}
              placeholder="Search email"
              value={data.email}
            />
          </td>
          <td>
            <Input
              onChange={e => onHandleInputChange(e)}
              type="select"
              name="gender"
              value={data.gender}
            >
              <option value="">Default</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Input>
          </td>
          <td className="d-flex justify-content-center">
            <Button color="success" onClick={() => onHandleClearFilter()}>
              Clear filter
            </Button>{" "}
          </td>
        </tr>
        {users &&
          users.map((user, index) => (
            <tr key={user.id} className="text-center">
              <th scope="row">{(_page - 1) * _limit + index + 1}</th>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>
                <Button
                  onClick={() => onHandleDelete(user.id)}
                  className="me-2"
                  color="warning"
                >
                  Xoá
                </Button>
                <Button onClick={() => onHandleEdit(user)} color="primary">
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
      <Modal
        toggle={() => setModal({ ...modal, open: false })}
        isOpen={modal.open}
      >
        <ModalBody>
          <h5>
            Bạn chắc chắn muốn xoá người dùng này ? <br /> Việc làm này không
            thể hoàn tác
          </h5>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onAcceptDelete()} color="primary">
            Đồng ý
          </Button>
          <Button
            color="primary"
            onClick={() => setModal({ ...modal, open: false })}
          >
            Quay lại
          </Button>
        </ModalFooter>
      </Modal>
    </Table>
  )
}

export default React.memo(UserTable)
