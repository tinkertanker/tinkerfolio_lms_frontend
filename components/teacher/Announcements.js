import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CustomPopup from "../../utils/CustomPopup";
import CustomLinkify from "../../utils/CustomLinkify"
import { AuthContext } from "../../contexts/Auth.Context";
import beautifyDate from "../../utils/beautifyDate";

import {
    CreateOutline,
    TrashOutline,
} from "react-ionicons";

const Announcements = ({ classroom, announcements, setAnnouncements }) => {
    const { getAccessToken } = useContext(AuthContext);

    const addAnnouncement = (announcement) => {
        getAccessToken().then((accessToken) => {
            axios
                .post( process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/announcements/",
                    { code: classroom.code, ...announcement },
                    { headers: { Authorization: "Bearer " + accessToken } }
                )
                .then((res) => { setAnnouncements([...announcements, res.data]) });
        });
    };

    const deleteAnnouncement = (id) => {
        try {
            const existingAnnouncement = announcements.filter(subAnnouncement => subAnnouncement.id === id)
            const existingIndex = Object.keys(announcements).find(key => announcements[key] === existingAnnouncement[0])

            getAccessToken().then((accessToken) => {
                axios
                    .delete( process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/announcements/" + id.toString() + "/",
                        { headers: { Authorization: "Bearer " + accessToken } }
                    )
                    .then((res) => {
                        setAnnouncements([
                            ...announcements.filter(subAnnouncement => Object.keys(announcements).find(key => announcements[key] === subAnnouncement) < existingIndex),
                            res.data,
                            ...announcements.filter(subAnnouncement => Object.keys(announcements).find(key => announcements[key] === subAnnouncement) > existingIndex),
                        ])
                    })
            });
        } catch (error) {
            console.log("Something went wrong...")
        }
    };

    const updateAnnouncement = (name, description, id) => {
        try {
            const existingAnnouncement = announcements.filter(subAnnouncement => subAnnouncement.id === id)
            const existingIndex = Object.keys(announcements).find(key => announcements[key] === existingAnnouncement[0])

            const formData = new FormData()
            name && formData.append("name", name)
            description && formData.append("description", description)

            getAccessToken().then((accessToken) => {
                axios
                    .put( process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/announcements/" + id.toString() + "/", formData,
                        { headers: { Authorization: "Bearer " + accessToken } }
                    )
                    .then((res) => {
                        setAnnouncements([
                            ...announcements.filter(subAnnouncement => Object.keys(announcements).find(key => announcements[key] === subAnnouncement) < existingIndex),
                            res.data,
                            ...announcements.filter(subAnnouncement => Object.keys(announcements).find(key => announcements[key] === subAnnouncement) > existingIndex),
                        ])
                    })
                    .catch(res => {
                        console.log("err:", res)
                    })
            });
        } catch (error) {
            console.log("Something went wrong...")
        }
    }

    return (
        <section>
            <div className="flex flex-row flex-1 items-center">
                <h1 className="font-bold text-2xl w-1/2">Announcements</h1>
                <NewAnnouncement addAnnouncement={addAnnouncement} popupClose={close} />
            </div>
            <div className="mb-4 flex flex-col-reverse">
                {announcements.map((announcement, i) => (
                    <>
                        {announcement.name && (
                            <div
                                className="flex flex-col mt-6 bg-gray-200 shadow-md p-4 border rounded-lg"
                                key={i}
                            >
                                <div className="flex flex-row">
                                    <h3 className="font-bold text-xl text-blue-600">{announcement.name}</h3>
                                    <div className="ml-auto flex flex-row gap-2">
                                        <UpdateAnnouncement
                                            updateAnnouncement={updateAnnouncement}
                                            existingAnnouncement={announcement}
                                            popupClose={close}
                                        />
                                        <DeleteAnnouncement
                                            id={announcement.id}
                                            deleteAnnouncement={deleteAnnouncement}
                                            popupClose={close}
                                        />
                                    </div>
                                </div>
                                <p className="my-2 whitespace-pre-wrap">
                                    <CustomLinkify>{announcement.description}</CustomLinkify>
                                </p>
                                <p className="my-2 text-xs text-gray-500">
                                    {beautifyDate(announcement.updated_at.slice(0, 10))}
                                </p>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </section>
    )
}

export default Announcements;


const NewAnnouncement = ({ addAnnouncement, popupClose }) => {
    const [announcement, setAnnouncement] = useState({
        name: "",
        description: "",
    });

    return (
        <CustomPopup
            trigger={
                <button className="w-1/2 text-base flex justify-end text-gray-500 hover:text-blue-600 focus:outline-none">
                    <p>Add Announcement</p>
                </button>
            }
        >
            {(close) => (
                <form
                    className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addAnnouncement(announcement);
                        setAnnouncement({ name: "", description: "" }); // reset form fields
                        close();
                    }}
                >
                    <h1 className="font-bold text-2xl border-b-2 border-gray-300 focus:border-gray-500 my-2 mx-2">
                        Create Announcement
                    </h1>
                    <label htmlFor="name" className="my-2 mx-2">Title:</label>
                    <input
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 mx-2 rounded-lg"
                        value={announcement.name}
                        name="name"
                        autoComplete="off"
                    />
                    <label htmlFor="description" className="mt-4 mb-2 mx-2">Body:</label>
                    <textarea
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 mx-2 rounded-lg"
                        rows="8"
                        value={announcement.description}
                        name="description"
                    />
                    <div className="flex flex-row justify-end gap-4">
                        <button
                            className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min border bg-gray-500 hover:bg-gray-600 rounded text-white font-bold"
                            onClick={() => {
                                setAnnouncement({ name: "", description: "" });
                                close();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
                        >
                            Done
                        </button>
                    </div>
                </form>
            )}
        </CustomPopup>
    );
};

const DeleteAnnouncement = ({ id, deleteAnnouncement, popupClose }) => {
    return (
        <CustomPopup
            trigger={
                <button className="focus:outline-none">
                    <TrashOutline color={"#00000"} title={"Delete"} height="20px" width="20px" />
                </button>
            }
        >
            {(close) => (
                <div className="flex flex-col px-6 py-8 bg-white rounded-lg w-56 sm:w-80">
                    <h1 className="text-xl font-semibold text-center">
                        Are you sure?
                    </h1>
                    <p className="text-gray-500 mt-2">
                        This announcement cannot be recovered.
                    </p>
                    <div className="flex flex-col mt-4">
                        <button
                            className="focus:outline-none px-2 py-1 border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700 rounded mb-2"
                            onClick={() => {
                                deleteAnnouncement(id);
                                close();
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="focus:outline-none px-2 py-1 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded"
                            onClick={() => {
                                close();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </CustomPopup>
    );
};

const UpdateAnnouncement = ({ updateAnnouncement, existingAnnouncement, popupClose }) => {
    const [announcement, setAnnouncement] = useState({
        name: existingAnnouncement.name,
        description: existingAnnouncement.description,
    });

    return (
        <CustomPopup
            trigger={
                <button className="focus:outline-none">
                    <CreateOutline color={"#00000"} title={"Update"} height="20px" width="20px" />
                </button>
            }
        >
            {(close) => (
                <form
                    className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup"
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateAnnouncement(announcement.name, announcement.description, existingAnnouncement.id);
                        setAnnouncement({ name: announcement.name, description: announcement.description });
                        close();
                    }}
                >
                    <h1 className="font-bold text-2xl border-b-2 border-gray-300 focus:border-gray-500 my-2 mx-2">
                        Update Announcement
                    </h1>
                    <label htmlFor="name" className="my-2 mx-2">Title:</label>
                    <input
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 mx-2 rounded-lg"
                        value={announcement.name}
                        name="name"
                        autoComplete="off"
                    />
                    <label htmlFor="description" className="mt-4 mb-2 mx-2">Body:</label>
                    <textarea
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                [e.target.name]: e.target.value,
                            })
                        }
                        className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 mx-2 rounded-lg"
                        rows="8"
                        value={announcement.description}
                        name="description"
                    />
                    <div className="flex flex-row justify-end gap-4">
                        <button
                            className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min border bg-gray-500 hover:bg-gray-600 rounded text-white font-bold"
                            onClick={() => {
                                setAnnouncement({ name: existingAnnouncement.name, description: existingAnnouncement.description });
                                close();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
                        >
                            Done
                        </button>
                    </div>
                </form>
            )}
        </CustomPopup>
    );
};
