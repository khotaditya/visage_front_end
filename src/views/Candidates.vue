<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Submit candidate details" active>
          <div class="row mb-1">
            <div v-if="step === 1">
              <b-progress :value="0" variant="success" striped></b-progress>
            </div>
            <div v-else-if="step === 2">
              <b-progress :value="50" variant="success" striped></b-progress>
            </div>
            <div v-else-if="step === 3">
              <b-progress :value="100" variant="success" striped></b-progress>
            </div>
            <b-card-text>
              <div class="row mb-1">
                <div class="col-sm-4"><h3>Upload CV</h3></div>
                <div class="col-sm-4"><h3>Candidate information</h3></div>
                <div class="col-sm-4"><h3>Details</h3></div>
              </div>
            </b-card-text>
            <b-card-text
              ><br />
              <div
                id="loader"
                v-if="loader"
                class="text-center text-danger my-2"
              >
                <b-spinner class="align-middle"></b-spinner>
                <strong> Loading...</strong>
              </div>
              <simplert> </simplert>
              <b-form
                class="align-self-center w-80"
                id="registration"
                enctype="multipart/form-data"
              >
                <div v-if="step === 1">
                  <div class="row">
                    <div class="col-md-4">
                      <label>Upload candidate CV</label>
                      <input
                        id="cv"
                        type="file"
                        ref="files"
                        style="display: none"
                        @change="onFileChange"
                        accept="application/pdf"
                      />
                      <input
                        type="button"
                        value="Browse..."
                        onclick="document.getElementById('cv').click();"
                        style="margin-left: 10px"
                      />
                      <br />
                      <div v-if="pdf">
                        <p>{{ pdf }}<a class="close" @click="delImg()">×</a></p>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div class="row">
                    <div class="col-md-12">
                      <b-button
                        variant="primary"
                        @click.prevent="next()"
                        :disabled="file1 == 0"
                        >Next</b-button
                      >
                    </div>
                  </div>
                </div>
                <div v-if="step === 2">
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                      <label>First name (*): </label>
                      <input
                        type="text"
                        v-model="registration.first_name"
                        id="first_name"
                        name="first_name"
                        class="form-control form-control-lg"
                      />
                    </div>

                    <div class="col-md-4">
                      <label>Last name (*): </label>
                      <input
                        type="text"
                        v-model="registration.last_name"
                        id="last_name"
                        name="last_name"
                        class="form-control form-control-lg"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                      <label>Email (*): </label>
                      <input
                        type="email"
                        v-model="registration.email"
                        id="email"
                        name="email"
                        class="form-control form-control-lg"
                      />
                    </div>

                    <div class="col-md-4">
                      <label>Job title (*): </label>
                      <input
                        type="text"
                        v-model="registration.job_title"
                        id="job_title"
                        name="job_title"
                        class="form-control form-control-lg"
                      />
                    </div>
                  </div>
                  <br />
                  <div class="row">
                    <div class="col-md-12">
                      <b-button variant="primary" @click.prevent="prev()"
                        >Previous</b-button
                      >
                      <b-button
                        variant="primary"
                        :disabled="$v.registration.$invalid"
                        @click.prevent="next()"
                        style="margin-left: 15px"
                        >Next</b-button
                      >
                    </div>
                  </div>
                </div>
                <div v-if="step === 3">
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8" style="text-align: left">
                      <label>First name: </label> {{ registration.first_name }}
                      <br /><br />
                      <label>Last name: </label> {{ registration.last_name }}
                      <br /><br />
                      <label>Email: </label> {{ registration.email }}
                      <br /><br />
                      <label>Job title: </label> {{ registration.job_title }}
                      <br /><br />
                      <label>CV: </label> {{ pdf }} <br /><br />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-4">
                      <b-button variant="primary" @click.prevent="prev()"
                        >Previous</b-button
                      >
                      <b-button
                        style="margin-left: 10px"
                        type="submit"
                        @click.prevent="handleSubmit(registration)"
                        variant="primary"
                        >Submit</b-button
                      >
                    </div>
                  </div>
                </div>
              </b-form>
            </b-card-text>
          </div>
        </b-tab>
        <b-tab title="List of candidates">
          <b-card-text>
            <div class="d-flex flex-column">
              <div class="overflow-auto">
                <b-pagination
                  class="customPagination"
                  v-model="table.currentPage"
                  :total-rows="rows"
                  :per-page="table.perPage"
                  aria-controls="candidate-table"
                ></b-pagination>
                <p class="mt-3">Current Page: {{ table.currentPage }}</p>
                <p class="mt-3">Total submission: {{ totalSubmission }}</p>
                <b-table
                  style="height: 500px"
                  id="bugReport-table"
                  :items="table.items"
                  :fields="table.fields"
                  :per-page="table.perPage"
                  :current-page="table.currentPage"
                  :busy="table.loading"
                  small
                  responsive
                  striped
                  tbody-tr-class="tableClass"
                >
                  <template v-slot:cell(cv_id)="row">
                    <a href="#" @click="getCV(row.item.cv_id)">
                      <b-icon
                        icon="download"
                        aria-hidden="true"
                        class="mr-2"
                      ></b-icon>
                    </a>
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong> Loading...</strong>
                    </div>
                  </template>
                </b-table>
              </div>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { required, email } from "vuelidate/lib/validators";
import {
        getBaseURL
    } from "@/utilities";
export default {
  name: "Candidates",
  data() {
    return {
      loader: false,
      file1: 0,
      attachment: "",
      files: null,
      step: 1,
      pdf: "",
      registration: {
        first_name: "",
        last_name: "",
        email: "",
        job_title: "",
      },
      isSubmitted: false,
      totalSubmission: 0,
      requestCount: 0,
      table: {
        fields: [
          {
            key: "first_name",
            label: "First name",
          },
          {
            key: "last_name",
            label: "Last name",
          },
          {
            key: "email",
            label: "Email",
          },
          {
            key: "created_at",
            label: "Created at",
          },
          {
            key: "filename",
            label: "CV",
          },
          {
            key: "cv_id",
            label: "",
          },
        ],
        items: [],
        alert: "",
        perPage: 10,
        currentPage: 1,
        loading: false,
      },
    };
  },
  validations: {
    registration: {
      first_name: { required },
      last_name: { required },
      email: { required, email },
      job_title: { required },
    },
  },
  computed: {
    rows() {
      return this.table.items.length;
    },
  },
  methods: {
    prev() {
      this.step--;
    },
    next() {
      this.isSubmitted = true;
      this.step++;
    },
    onFileChange(e) {
      this.fil = this.$refs.files.files[0];
      console.log("size", this.fil.size);
      let size = Math.floor(this.fil.size / 1024);
      if (size > 5 * 1024 * 1024) {
        alert("Please select a picture within 5M! ");
        return false;
      }
      this.pdf = this.fil.name;
      this.files = e.target.files;

      this.file1 = 1;
    },

    delImg() {
      this.pdf = "";
      this.file1 = 0;
    },
    viewList() {
      this.table.loading = true;
      axios
        .get(getBaseURL() +"/get_candidate")
        .then((response) => {
          if (response.data.output == "success") {
            this.table.items = response.data.message;
            this.totalSubmission = this.table.items.length;
            this.table.alert = "";
          } else {
            this.table.alert = response.data.message;
          }
          this.table.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.table.alert = error;
          this.table.loading = false;
        });
    },
    getCV(item) {
      let config = {
        params: { id: item },
      };
      axios
        .get(getBaseURL() +"/get_cv", config)
        .then((response) => {
          if (response.data.output == "success") {
            this.attachment = response.data.message.attachment;
            this.downloadAttachment(
              response.data.message.filename,
              this.attachment
            );
          } else {
            this.table.alert = response.data.message;
          }
        })
        .catch((error) => {
          console.log(error);
          this.table.alert = "Internal Server Error";
          this.table.loading = false;
        });
    },
    downloadAttachment(filename, data) {
      let link = document.createElement("a");
      if (link.download !== undefined) {
        let url = "data:application/octet-stream;base64," + data;
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    resetForm: function () {
      this.registration.first_name = "";
      this.registration.last_name = "";
      this.registration.email = "";
      this.registration.job_title = "";
      this.pdf = "";
      this.file1 = 0;
      this.step = 1;
    },
    handleSubmit: async function (registration) {
      this.loader = true;
      this.isSubmitted = true;
      var cv = this.files;
      if (cv) {
        const formData = new FormData();
        for (const i of Object.keys(this.files)) {
          formData.append("files", this.files[i]);
        }
        //formData.append("files", cv);
        formData.append("first_name", registration.first_name);
        formData.append("last_name", registration.last_name);
        formData.append("email", registration.email);
        formData.append("job_title", registration.job_title);
        await axios
          .post(getBaseURL() +"/add_candidate", formData)
          .then((res) => {
            if (res.data.output == "success") {
              this.loader = false;
              var count = this.totalSubmission + 1;

              console.log("count", count % 10);
              if (count % 10 !== 0) {
                let obj = {
                  title: "Success",
                  message: "Candidate profile has been submitted!",
                  type: "success",
                  onClose: this.resetForm,
                };
                this.$Simplert.open(obj);
              } else {
                let obj = {
                  title: "Success",
                  message:
                    "Candidate profile has been submitted! Every day feels like I’ve died and gone to hell",
                  type: "success",
                  onClose: this.resetForm,
                };
                this.$Simplert.open(obj);
              }

              this.viewList(this.table);
            } else {
              this.loader = false;
              console.log("error:", res.data.message);
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      } else {
        console.log("file not uploaded");
      }
    },
  },
  mounted() {
    this.viewList(this.table);
  },
};
</script>
<style>
.close:hover {
  cursor: pointer;
}
</style>