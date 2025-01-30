/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import leoProfanity from "leo-profanity";
import { API_ROUTES } from "../../../api";

const ModalCreatingChannel = ({ show, onHide, createChannel, token }) => {
  const { t } = useTranslation();
  const notifySuccess = () => toast.success(t("noticeChannelCreated"));
  const notifyError = () => toast.warning(t("errCreateChannelNetwork"));
  const channelsList = useSelector((state) => state.channels.entities);
  const existingNames = Object.values(channelsList).map((el) => el.name);
  const inputRef = useRef(null);

  useEffect(() => {
    leoProfanity.loadDictionary("en");
    // leoProfanity.loadDictionary('ru'); // 'ru' / 'fr' / 'en'
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, t("errCreateChannelLength"))
      .max(20, t("errCreateChannelLength"))
      .required(t("errCreateChannelEmpty"))
      .notOneOf(existingNames, t("errRenameChannelDouble")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) return;
      const filteredName = leoProfanity.clean(values.name);
      const isProfane = filteredName !== values.name;

      const channelNameToSend = isProfane
        ? "*".repeat(values.name.length)
        : filteredName;

      await axios
        .post(
          API_ROUTES.channels.list(),
          { name: channelNameToSend },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          createChannel(response.data);
          formik.resetForm();
          onHide();
          notifySuccess();
        })
        .catch((err) => {
          console.warn(err.message);
          notifyError();
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const handleClose = () => {
    formik.resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("createChannelHeader")}</Modal.Title>{" "}
        {/* Используйте локализацию */}
      </Modal.Header>
      <Modal.Body>
        <form className="mb-3" onSubmit={formik.handleSubmit}>
          <label className="visually-hidden" htmlFor="name">
            Имя канала
          </label>
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <span className="bg-warning">
            {formik.errors.name ? formik.errors.name : null}
          </span>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("close")}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onKeyDown={(e) => {
            if (e.key === "Enter") formik.handleSubmit(e);
          }}
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting}
        >
          {t("submitCreateChannelBtn")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreatingChannel;
