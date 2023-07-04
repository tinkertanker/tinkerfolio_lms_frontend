import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CustomPopup from "../../utils/CustomPopup";
import { AuthContext } from "../../contexts/Auth.Context";

import { CreateOutline, TrashOutline } from "react-ionicons";

const Resources = ({ classroom, resources, setResources }) => {
  const { getAccessToken } = useContext(AuthContext);

  const addResource = (resource) => {
    const formData = new FormData();
    formData.append("code", classroom.code);
    resource.name && formData.append("name", resource.name);

    for (let i = 0; i < resource.files.length; i++) {
      formData.append("file_" + (i + 1).toString(), resource.files[i]);
    }

    getAccessToken().then((accessToken) => {
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/resource_section/",
          formData,
          { headers: { Authorization: "Bearer " + accessToken } }
        )
        .then((res) => {
          setResources([...resources, res.data]);
        })
        .catch((res) => {
          console.log(res);
        });
    });
  };

  const deleteResourceSection = (id, index) => {
    try {
      getAccessToken().then((accessToken) => {
        axios
          .delete(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "core/resource_section/" +
              id.toString() +
              "/",
            { headers: { Authorization: "Bearer " + accessToken } }
          )
          .then((res) => {
            setResources([
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) <
                  index
              ),
              res.data,
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) >
                  index
              ),
            ]);
          });
      });
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const createOneResource = (existingResource, resource, id, index) => {
    const formData = new FormData();
    formData.append("resource_section_id", id);
    formData.append("file", resource.new_file);

    getAccessToken().then((accessToken) => {
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/resource/",
          formData,
          { headers: { Authorization: "Bearer " + accessToken } }
        )
        .then((res) => {
          existingResource.resources.push(res.data);
          setResources([
            ...resources.filter(
              (r) =>
                Object.keys(resources).find((key) => resources[key] === r) <
                index
            ),
            existingResource,
            ...resources.filter(
              (r) =>
                Object.keys(resources).find((key) => resources[key] === r) >
                index
            ),
          ]);
        })
        .catch((res) => {
          console.log(res);
        });
    });
  };

  const deleteOneResource = (
    existingResource,
    existingOneResource,
    id,
    index
  ) => {
    try {
      getAccessToken().then((accessToken) => {
        axios
          .delete(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "core/resource/" +
              id +
              "/",
            { headers: { Authorization: "Bearer " + accessToken } }
          )
          .then((res) => {
            let indexRes =
              existingResource.resources.indexOf(existingOneResource);
            existingResource.resources.splice(indexRes, 1);

            setResources([
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) <
                  index
              ),
              existingResource,
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) >
                  index
              ),
            ]);
          });
      });
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const reloadResource = (id, existingOneResource, existingResource, index) => {
    if (
      existingOneResource.file.slice(
        existingOneResource.file.indexOf("&Expires=") + 9
      ) > Math.floor(Date.now() / 1000)
    ) {
      window.open(existingOneResource.file);
    } else {
      getAccessToken().then((accessToken) => {
        axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE +
              "core/resource/" +
              id.toString() +
              "/",
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            let indexRes =
              existingResource.resources.indexOf(existingOneResource);
            existingResource.resources = [
              ...existingResource.resources.slice(0, indexRes),
              res.data,
              ...existingResource.resources.slice(indexRes + 1),
            ];

            setResources([
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) <
                  index
              ),
              existingResource,
              ...resources.filter(
                (r) =>
                  Object.keys(resources).find((key) => resources[key] === r) >
                  index
              ),
            ]);

            window.open(res.data.file);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  };

  return (
    <section>
      <div className="flex flex-row flex-1 items-center">
        <h1 className="font-bold text-2xl w-1/2">Resources</h1>
        <NewResource addResource={addResource} popupClose={close} />
      </div>
      <div className="mb-4">
        {resources.map((resource, i) => (
          <>
            {resource.section && (
              <div
                className="flex flex-col mt-6 bg-gray-200 shadow-md p-4 border rounded-lg"
                key={i}
              >
                <div className="flex flex-row">
                  <h3 className="font-bold text-xl">{resource.section.name}</h3>
                  <div className="ml-auto flex flex-row gap-2">
                    <UpdateResource
                      createOneResource={createOneResource}
                      index={i}
                      existingResource={resource}
                      popupClose={close}
                    />
                    <DeleteResourceSection
                      id={resource.section.id}
                      index={i}
                      deleteResourceSection={deleteResourceSection}
                      popupClose={close}
                    />
                  </div>
                </div>
                {resource.resources.map((file, _) => (
                  <div className="flex flex-row items-center mt-2">
                    <p
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                      onClick={() => reloadResource(file.id, file, resource, i)}
                    >
                      {file.name}
                    </p>
                    <DeleteResource
                      existingResource={resource}
                      existingOneResource={file}
                      index={i}
                      deleteOneResource={deleteOneResource}
                      popupClose={close}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export default Resources;

const NewResource = ({ addResource, popupClose }) => {
  const [resource, setResource] = useState({
    name: "",
    files: [],
  });

  return (
    <CustomPopup
      trigger={
        <button className="w-1/2 text-base flex justify-end text-gray-500 hover:text-blue-600 focus:outline-none">
          <p>Add Resource</p>
        </button>
      }
    >
      {(close) => (
        <form
          className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup"
          onSubmit={(e) => {
            e.preventDefault();
            addResource(resource);
            setResource({ name: "", files: [] }); // reset form fields
            close();
          }}
        >
          <h1 className="font-bold text-2xl border-b-2 border-gray-300 focus:border-gray-500 my-2 mx-2">
            Create Resource Category
          </h1>
          <label htmlFor="name" className="my-2 mx-2">
            Title:
          </label>
          <input
            onChange={(e) =>
              setResource({
                ...resource,
                [e.target.name]: e.target.value,
              })
            }
            className="outline-none resize-none text-sm border-2 border-gray-300 focus:border-gray-500 py-2 px-2 mx-2 rounded-lg"
            value={resource.name}
            name="name"
            autoComplete="off"
          />
          <input
            type="file"
            multiple
            className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg ml-2 mt-4"
            onChange={(e) => {
              setResource({ ...resource, files: e.target.files });
            }}
          />
          <div className="flex flex-row justify-end gap-4">
            <button
              className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min border bg-gray-500 hover:bg-gray-600 rounded text-white font-bold"
              onClick={() => {
                setResource({ name: "", files: [] });
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

const DeleteResourceSection = ({
  id,
  index,
  deleteResourceSection,
  popupClose,
}) => {
  return (
    <CustomPopup
      trigger={
        <button className="focus:outline-none">
          <TrashOutline
            color={"#00000"}
            title={"Delete"}
            height="20px"
            width="20px"
          />
        </button>
      }
    >
      {(close) => (
        <div className="flex flex-col px-6 py-8 bg-white rounded-lg w-56 sm:w-80">
          <h1 className="text-xl font-semibold text-center">Are you sure?</h1>
          <p className="text-gray-500 mt-2">
            This resource section cannot be recovered.
          </p>
          <div className="flex flex-col mt-4">
            <button
              className="focus:outline-none px-2 py-1 border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700 rounded mb-2"
              onClick={() => {
                deleteResourceSection(id, index);
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

const DeleteResource = ({
  existingResource,
  existingOneResource,
  index,
  deleteOneResource,
  popupClose,
}) => {
  return (
    <CustomPopup
      trigger={
        <button className="focus:outline-none ml-2">
          <TrashOutline
            color={"#00000"}
            title={"Delete"}
            height="15px"
            width="15px"
          />
        </button>
      }
    >
      {(close) => (
        <div className="flex flex-col px-6 py-8 bg-white rounded-lg w-56 sm:w-80">
          <h1 className="text-xl font-semibold text-center">Are you sure?</h1>
          <p className="text-gray-500 mt-2">
            This resource cannot be recovered.
          </p>
          <div className="flex flex-col mt-4">
            <button
              className="focus:outline-none px-2 py-1 border border-red-300 text-red-500 hover:bg-red-100 hover:border-red-500 hover:text-red-700 rounded mb-2"
              onClick={() => {
                deleteOneResource(
                  existingResource,
                  existingOneResource,
                  existingOneResource.id.toString(),
                  index
                );
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

const UpdateResource = ({
  createOneResource,
  existingResource,
  popupClose,
  index,
}) => {
  const [resource, setResource] = useState({
    name: existingResource.section.name,
    files: existingResource.resources,
    new_file: [],
  });

  return (
    <CustomPopup
      trigger={
        <button className="focus:outline-none">
          <CreateOutline
            color={"#00000"}
            title={"Update"}
            height="20px"
            width="20px"
          />
        </button>
      }
    >
      {(close) => (
        <form
          className="flex flex-col px-4 py-4 bg-white rounded-lg shadow-md popup"
          onSubmit={(e) => {
            e.preventDefault();
            createOneResource(
              existingResource,
              resource,
              existingResource.section.id.toString(),
              index
            );
            close();
          }}
        >
          <h1 className="font-bold text-2xl border-b-2 border-gray-300 focus:border-gray-500 my-2 mx-2">
            Update Resource Section
          </h1>
          <p className="my-2 mx-2 font-bold text-xl">{resource.name}</p>

          {existingResource.resources.map((file, i) => (
            <a
              className="text-blue-600 hover:text-blue-700 mt-2 mx-2"
              href={file.file}
              target="_blank"
            >
              {file.name}
            </a>
          ))}

          <input
            type="file"
            className="bg-gray-400 text-white px-2 py-1 w-min text-sm rounded-lg ml-2 mt-4"
            onChange={(e) =>
              setResource({ ...resource, new_file: e.target.files[0] })
            }
          />

          <div className="flex flex-row justify-end gap-4">
            <button
              className="focus:outline-none mt-4 ml-2 px-2 py-1 w-min border bg-gray-500 hover:bg-gray-600 rounded text-white font-bold"
              onClick={() => {
                setResource({
                  name: existingResource.section.name,
                  files: existingResource.resources,
                });
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
