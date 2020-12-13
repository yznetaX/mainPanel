<template>
  <div :class="smallScrenn" class="px-2" id="main-vue" v-resize="onResize">
    <vue-topprogress
      ref="topProgress"
      :color="'#81217d'"
      :height="3"
    ></vue-topprogress>
    <confirm ref="setConfirm"></confirm>
    <v-overlay :value="overlay" color="white" opacity="1">
      <v-row align-content="center" justify="center" :class="loadingPadding">
        <v-progress-circular
          style="width:300px"
          color="grey darken-2"
          indeterminate
          rounded
          :size="30"
        >
        </v-progress-circular>
      </v-row>
    </v-overlay>
    <div v-if="showContent">
      <v-card-title class="pt-1 px-0 secondary--text mujeebk-title">
        <Backword v-if="showBackword" />
        {{ $t("mujeebk_settings") }}
      </v-card-title>
      <!-- <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 "> -->
      <v-alert
        @click="$router.push('/mujeebk_web')"
        color="red darken-4"
        border="left"
        colored-border
        type="error"
        elevation="2"
        v-model="errorMessageNumber"
      >
        <span class="d-block">{{ dialogModalErrorNumber }}</span>
        <div class="mt-2">
          <v-btn color="red darken-4 mx-auto" dark small to="/mujeebk_web">
            <v-icon class="me-1">mdi-qrcode</v-icon>
            <span>{{ $t("rescan_qr_code") }}</span>
          </v-btn>
        </div>
      </v-alert>
      <!-- </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 " ref="manage" id="manage">
          <v-card-text
            class="subtitle-1 pt-0 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("manage_contact_list") }}</v-card-text
          >
          <v-select
            v-model="manageListValue"
            :items="manageList"
            :label="$t('choose')"
            :item-text="manageVal"
            item-value="name"
            solo
            ref="manageRef"
            append-outer-icon="mdi-account-box-outline"
            dense
            @change="manageChange"
            :menu-props="autocompleteMenuProps"
          >
            <template v-slot:selection="{ item }">
              <span class="subtitle-2">{{ $t(item.name) }}</span>
            </template>
            <template v-slot:item="{ item }">
              <v-list dense class="pa-0">
                <v-list-item dense class="pa-0">
                  <span class="subtitle-2">
                    {{ $t(item.name) }}
                  </span>
                </v-list-item>
              </v-list>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("time_zone") }}</v-card-text
          >
          <v-autocomplete
            v-model="timezoneValue"
            :items="timeZone"
            ref="timeZoneSelect"
            :filter="customFilter"
            item-text="text"
            item-value="value"
            color="secondary"
            :label="$t('pick_time_zone')"
            style="font-family: Cairo !important"
            dense
            append-outer-icon="mdi-earth"
            @click:append-outer="clearTimeZone"
            solo
            @change="shareValueTimezone"
            :menu-props="autocompleteMenuProps"
            :loading="timeZoneLoader"
            :placeholder="placeholderTimeZone"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("alt_account") }}</v-card-text
          >
          <v-subheader
            style="font-family: Cairo !important;letter-spacing: 0;"
            class="px-0 mb-4"
          >
            {{ $t("alt_account_disc") }}
          </v-subheader>
          <v-text-field
            @change="newEmail"
            v-model="newEmailSet"
            ref="altEmail"
            solo
            dense
            :label="$t('your_email')"
            append-outer-icon="mdi-email"
            :rules="emailRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0">
          <v-card-text
            class="subtitle-1 py-0 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("show_battery_status") }}</v-card-text
          >
          <v-subheader
            style="font-family: Cairo !important;letter-spacing: 0;"
            class="px-0"
          >
            <v-switch
              color="secondary"
              inset
              v-model="showBatteryStatusSwitch"
              @change="changeBatteryStatusSwitch"
            ></v-switch>
            <span
              class="subtitle-2 my-auto"
              style="font-family: Cairo !important;"
              >{{ $t("show_battery_status_description") }}</span
            >
          </v-subheader>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="10" md="10" class="py-0">
          <v-card-text
            class="subtitle-1 pa-0"
            style="font-family: Cairo !important;"
            >{{ $t("time_format") }}</v-card-text
          >
          <v-subheader
            style="font-family: Cairo !important;letter-spacing: 0;"
            class="px-0"
          >
            <v-switch
              color="secondary"
              inset
              v-model="timeFormatSwitch"
              @change="timeFormatValue"
            ></v-switch>
            <span
              class="subtitle-2 my-auto"
              style="font-family: Cairo !important;"
              >{{ $t("time_format_discription") }}</span
            >
          </v-subheader>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="10" md="10" class="py-0">
          <v-card-text
            class="subtitle-1 pa-0"
            style="font-family: Cairo !important;"
            >{{ $t("operating_hours") }}</v-card-text
          >
          <v-subheader
            style="font-family: Cairo !important;letter-spacing: 0;"
            class="px-0"
            >{{ $t("operating_hours_discription") }}</v-subheader
          >
          <v-col
            class="pa-0"
            cols="12"
            sm="10"
            md="10"
            v-for="(operating, index) in operatingHours"
            :key="operating.id"
          >
            <v-subheader class=" px-0">
              <v-switch
                height="10px"
                color="secondary"
                inset
                v-model="operating.switchValue"
                @change="operatingSliders"
              ></v-switch>
              <span
                class="subtitle-1 my-auto"
                style="font-family: Cairo !important;"
              >
                {{ days[index] }}
              </span>
              <span class="ms-2 subtitle-1">
                ( {{ minutesToHHMM(operating.value[0], timeFormatSwitch) }} -
                {{ minutesToHHMM(operating.value[1], timeFormatSwitch) }} )
              </span>
            </v-subheader>
            <v-range-slider
              class=""
              color="secondary"
              v-model="operating.value"
              track-color="#e0e0e0"
              max="1440"
              min="0"
              :disabled="!operating.switchValue"
              @change="checkSliderChange"
            >
            </v-range-slider>
          </v-col>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("blocked_states") }}</v-card-text
          >
          <v-autocomplete
            v-model="blockValue"
            ref="blockStates"
            :items="counteryCode"
            item-text="name"
            item-value="code"
            color="secondary"
            :label="$t('pick_states')"
            style="font-family: Cairo !important"
            dense
            append-outer-icon="mdi-cancel"
            @click:append-outer="clearBlockedCountrey"
            solo
            multiple
            :menu-props="autocompleteMenuProps"
            @blur="blockCountreyChange"
          >
            <template v-slot:selection="{ item, index }" class="secondary">
              <span v-if="index === 0" class="subtitle-2">{{ item.name }}</span>
              <span v-if="index === 1" class="grey--text caption ms-1">
                (+{{ blockValue.length - 1 }} {{ $t("others") }})</span
              >
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <!-- Allowed countery -->
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("allowed_states") }}</v-card-text
          >
          <v-autocomplete
            v-model="allowCountry"
            ref="block"
            :items="counteryCodeLang"
            item-text="name"
            item-value="code"
            color="secondary"
            :label="$t('pick_states')"
            style="font-family: Cairo !important"
            dense
            append-outer-icon="mdi-cancel"
            @click:append-outer="clearAllowedCountrey"
            solo
            multiple
            :menu-props="autocompleteMenuProps"
            @blur="allowCountreyChange"
            :disabled="disableAllowedCountry"
            :error-messages="
              disableAllowedCountry == true ? $t(planTypeError) : ''
            "
          >
            <template v-slot:selection="{ item, index }" class="secondary">
              <span v-if="index === 0" class="subtitle-2">{{ item.name }}</span>
              <span v-if="index === 1" class="grey--text caption ms-1">
                (+{{ allowCountry.length - 1 }} {{ $t("others") }})</span
              >
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <!-- Blocking Numbers API -->
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("blocked_number") }}</v-card-text
          >
          <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :filter="customNumberName"
            :placeholder="placeholderNumbers"
            item-text="name"
            item-value="name"
            @blur="blur"
            :label="$t('pick_blocked_number')"
            append-outer-icon="mdi-close"
            return-object
            @click:append-outer="clearBlockNumberArray"
            dense
            @keydown.enter="addNewNumber"
            solo
            multiple
            ref="model"
            :error="hasError"
            :error-messages="errorMessage"
            :hide-no-data="true"
            :menu-props="autocompleteMenuProps"
          >
            <template v-slot:no-data>
              <v-list-item v-if="showNoData">
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ search }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{ item, index }" class="secondary">
              <span v-if="index === 0" class="subtitle-2">{{ item.name }}</span>
              <span v-if="index === 1" class="grey--text caption ms-1">
                (+{{ model.length - 1 }} {{ $t("others") }})</span
              >
            </template>
          </v-autocomplete>
          <v-menu v-model="showMenu" offset-Y :position-x="x" :position-y="y">
            <v-card width="300">
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar class="bigAvatar" :show_online_dot="false">
                      <v-progress-circular
                        indeterminate
                        color="grey"
                        size="20"
                        v-if="isloaded"
                      ></v-progress-circular>
                      <img :src="profileImg" v-if="avatarImageLoaded" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="subtitle-2"
                      style="font-family:Cairo !important"
                    >
                      {{ thisName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ thisNumber }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="deleteItem(deleteIndex)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-chip-group
            multiple
            column
            ref="chipgroup"
            style="max-height: 150px !important"
          >
            <v-chip
              close
              @click:close="deleteItem(i)"
              v-for="(field, i) in fields"
              :key="i"
              @click="showThisField($event, field, i)"
            >
              <avatar
                :avatarClass="'smallAvatar me-2'"
                :phone_number="field.number"
                :color_avatar="'white'"
              />
              {{
                field.name.length > maxLength
                  ? field.name.slice(0, maxLength) + "..."
                  : field.name
              }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row>
        <!-- Allow Numbers API -->
        <v-col cols="12" sm="8" md="6" class="py-0 " id="allowed">
          <v-card-text
            class="subtitle-1 px-0 pt-0"
            style="font-family: Cairo !important;"
            >{{ $t("number_allow_reply") }}</v-card-text
          >
          <v-autocomplete
            v-model="allowedNumber"
            :placeholder="placeholderNumbers"
            :items="itemsAllow"
            :loading="isAllowLoading"
            :filter="customNumberName"
            item-text="name"
            item-value="name"
            @blur="allowedBlur"
            append-outer-icon="mdi-close"
            return-object
            :label="$t('pick_blocked_number')"
            @click:append-outer="clearAllowNumberArray"
            dense
            @keydown.enter="addAllowedNumber"
            solo
            multiple
            :error="hasErrorAllow"
            :error-messages="errorMessageAllow"
            :hide-no-data="true"
            :menu-props="autocompleteMenuProps"
            ref="allow"
          >
            <template v-slot:selection="{ item, index }" class="secondary">
              <span v-if="index === 0" class="subtitle-2">{{ item.name }}</span>
              <span v-if="index === 1" class="grey--text caption ms-1">
                (+{{ allowedNumber.length - 1 }} {{ $t("others") }})</span
              >
            </template>
          </v-autocomplete>
          <v-menu
            v-model="showAllowedMenu"
            offset-Y
            :position-x="xAllow"
            :position-y="yAllow"
          >
            <v-card width="300">
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <avatar
                      :avatarClass="'bigAvatar'"
                      :phone_number="thisAllowNumber"
                      :color_avatar="'white'"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      class="subtitle-2"
                      style="font-family:Cairo !important"
                    >
                      {{ thisAllowName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ thisAllowNumber }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="deleteAllowItem(deleteAllowIndex)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-chip-group
            multiple
            column
            ref="chipgroup"
            style="max-height: 150px !important"
          >
            <v-chip
              close
              @click:close="deleteAllowItem(i)"
              v-for="(allow, i) in numbersChecked"
              :key="i"
              @click="showAllowField($event, allow, i)"
            >
              <avatar
                :avatarClass="'smallAvatar me-2'"
                :phone_number="allow.number"
                :color_avatar="'white'"
              />
              {{
                allow.name.length > maxLength
                  ? allow.name.slice(0, maxLength) + "..."
                  : allow.name
              }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="py-0 ">
          <v-card-text
            class="subtitle-1 pt-0 px-0"
            style="font-family: Cairo !important;"
            >{{ $t("bot_respond_lang") }}</v-card-text
          >
          <v-select
            v-model="botRespondValue"
            :items="botRespondArray"
            :label="$t('pick_lang')"
            :item-text="langName"
            append-outer-icon="mdi-translate"
            item-value="name"
            ref="botRespond"
            solo
            dense
            @change="langSelectChange"
            :menu-props="autocompleteMenuProps"
          >
            <template v-slot:selection="{ item }">
              <span class="subtitle-2">{{ $t(item.name) }}</span>
            </template>
            <template v-slot:item="{ item }">
              <v-list dense class="pa-0">
                <v-list-item dense class="pa-0">
                  <v-img
                    width="25"
                    class="d-inline-block me-2"
                    :src="item.flag"
                  ></v-img>
                  <span class="subtitle-2">
                    {{ $t(item.name) }}
                  </span>
                </v-list-item>
              </v-list>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import Settings from "../mixins/httpHandler";
import i18n from "../plugins/i18n";
import { parsePhoneNumberFromString as parseMax } from "libphonenumber-js/max";
import confirm from "../components/settingsDialog";
import { bus } from "../main";
import avatar from "../components/automated/Avatar";
import Backword from '../components/Backword'
export default {
  components: {
    confirm,
    avatar,
    Backword
  },
  data() {
    return {
      disableAllowedCountry: false,
      itemsAllow: [],
      placeholderTimeZone: i18n.t("loading_countery"),
      placeholderNumbers: i18n.t("loading_numbers"),
      smallScrenn: "",
      newEmailSet: "",
      emailRules: [
        (v) => !!v || i18n.tc("email_is_required"),
        (v) => /.+@.+\..+/.test(v) || i18n.tc("email_valid"),
      ],
      showContent: false,
      snackbar: false,
      manage: "#manage",
      loadingPadding: "",
      overlay: true,
      showMenu: false,
      maxLength: 15,
      iconPhone: "mdi-account-multiple-check",
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      isAllowLoading: false,
      model: [],
      search: null,
      searchAllow: null,
      timeZone: [],
      value1: [9, 6],
      blockValue: [],
      allowCountry: [],
      showNoData: false,
      operatingHours: [
        {
          day: 0,
          value: [0, 1440],
          switchValue: true,
        },
        {
          day: 1,
          value: [0, 1440],
          switchValue: false,
        },
        {
          day: 2,
          value: [0, 1440],
          switchValue: false,
        },
        {
          day: 3,
          value: [0, 1440],
          switchValue: false,
        },
        {
          day: 4,
          value: [0, 1440],
          switchValue: false,
        },
        {
          day: 5,
          value: [0, 1440],
          switchValue: false,
        },
        {
          day: 6,
          value: [0, 1440],
          switchValue: false,
        },
      ],
      timeFormatSwitch: false,
      counteryCode: [
        {
          code: "AC",
          unicode: "U+1F1E6 U+1F1E8",
          name: "Ascension Island",
          emoji: "🇦🇨",
        },
        {
          code: "AD",
          unicode: "U+1F1E6 U+1F1E9",
          name: "Andorra",
          emoji: "🇦🇩",
        },
        {
          code: "AE",
          unicode: "U+1F1E6 U+1F1EA",
          name: "United Arab Emirates",
          emoji: "🇦🇪",
        },
        {
          code: "AF",
          unicode: "U+1F1E6 U+1F1EB",
          name: "Afghanistan",
          emoji: "🇦🇫",
        },
        {
          code: "AG",
          unicode: "U+1F1E6 U+1F1EC",
          name: "Antigua & Barbuda",
          emoji: "🇦🇬",
        },
        {
          code: "AI",
          unicode: "U+1F1E6 U+1F1EE",
          name: "Anguilla",
          emoji: "🇦🇮",
        },
        {
          code: "AL",
          unicode: "U+1F1E6 U+1F1F1",
          name: "Albania",
          emoji: "🇦🇱",
        },
        {
          code: "AM",
          unicode: "U+1F1E6 U+1F1F2",
          name: "Armenia",
          emoji: "🇦🇲",
        },
        {
          code: "AO",
          unicode: "U+1F1E6 U+1F1F4",
          name: "Angola",
          emoji: "🇦🇴",
        },
        {
          code: "AQ",
          unicode: "U+1F1E6 U+1F1F6",
          name: "Antarctica",
          emoji: "🇦🇶",
        },
        {
          code: "AR",
          unicode: "U+1F1E6 U+1F1F7",
          name: "Argentina",
          emoji: "🇦🇷",
        },
        {
          code: "AS",
          unicode: "U+1F1E6 U+1F1F8",
          name: "American Samoa",
          emoji: "🇦🇸",
        },
        {
          code: "AT",
          unicode: "U+1F1E6 U+1F1F9",
          name: "Austria",
          emoji: "🇦🇹",
        },
        {
          code: "AU",
          unicode: "U+1F1E6 U+1F1FA",
          name: "Australia",
          emoji: "🇦🇺",
        },
        {
          code: "AW",
          unicode: "U+1F1E6 U+1F1FC",
          name: "Aruba",
          emoji: "🇦🇼",
        },
        {
          code: "AX",
          unicode: "U+1F1E6 U+1F1FD",
          name: "Åland Islands",
          emoji: "🇦🇽",
        },
        {
          code: "AZ",
          unicode: "U+1F1E6 U+1F1FF",
          name: "Azerbaijan",
          emoji: "🇦🇿",
        },
        {
          code: "BA",
          unicode: "U+1F1E7 U+1F1E6",
          name: "Bosnia & Herzegovina",
          emoji: "🇧🇦",
        },
        {
          code: "BB",
          unicode: "U+1F1E7 U+1F1E7",
          name: "Barbados",
          emoji: "🇧🇧",
        },
        {
          code: "BD",
          unicode: "U+1F1E7 U+1F1E9",
          name: "Bangladesh",
          emoji: "🇧🇩",
        },
        {
          code: "BE",
          unicode: "U+1F1E7 U+1F1EA",
          name: "Belgium",
          emoji: "🇧🇪",
        },
        {
          code: "BF",
          unicode: "U+1F1E7 U+1F1EB",
          name: "Burkina Faso",
          emoji: "🇧🇫",
        },
        {
          code: "BG",
          unicode: "U+1F1E7 U+1F1EC",
          name: "Bulgaria",
          emoji: "🇧🇬",
        },
        {
          code: "BH",
          unicode: "U+1F1E7 U+1F1ED",
          name: "Bahrain",
          emoji: "🇧🇭",
        },
        {
          code: "BI",
          unicode: "U+1F1E7 U+1F1EE",
          name: "Burundi",
          emoji: "🇧🇮",
        },
        {
          code: "BJ",
          unicode: "U+1F1E7 U+1F1EF",
          name: "Benin",
          emoji: "🇧🇯",
        },
        {
          code: "BL",
          unicode: "U+1F1E7 U+1F1F1",
          name: "St. Barthélemy",
          emoji: "🇧🇱",
        },
        {
          code: "BM",
          unicode: "U+1F1E7 U+1F1F2",
          name: "Bermuda",
          emoji: "🇧🇲",
        },
        {
          code: "BN",
          unicode: "U+1F1E7 U+1F1F3",
          name: "Brunei",
          emoji: "🇧🇳",
        },
        {
          code: "BO",
          unicode: "U+1F1E7 U+1F1F4",
          name: "Bolivia",
          emoji: "🇧🇴",
        },
        {
          code: "BQ",
          unicode: "U+1F1E7 U+1F1F6",
          name: "Caribbean Netherlands",
          emoji: "🇧🇶",
        },
        {
          code: "BR",
          unicode: "U+1F1E7 U+1F1F7",
          name: "Brazil",
          emoji: "🇧🇷",
        },
        {
          code: "BS",
          unicode: "U+1F1E7 U+1F1F8",
          name: "Bahamas",
          emoji: "🇧🇸",
        },
        {
          code: "BT",
          unicode: "U+1F1E7 U+1F1F9",
          name: "Bhutan",
          emoji: "🇧🇹",
        },
        {
          code: "BV",
          unicode: "U+1F1E7 U+1F1FB",
          name: "Bouvet Island",
          emoji: "🇧🇻",
        },
        {
          code: "BW",
          unicode: "U+1F1E7 U+1F1FC",
          name: "Botswana",
          emoji: "🇧🇼",
        },
        {
          code: "BY",
          unicode: "U+1F1E7 U+1F1FE",
          name: "Belarus",
          emoji: "🇧🇾",
        },
        {
          code: "BZ",
          unicode: "U+1F1E7 U+1F1FF",
          name: "Belize",
          emoji: "🇧🇿",
        },
        {
          code: "CA",
          unicode: "U+1F1E8 U+1F1E6",
          name: "Canada",
          emoji: "🇨🇦",
        },
        {
          code: "CC",
          unicode: "U+1F1E8 U+1F1E8",
          name: "Cocos (Keeling) Islands",
          emoji: "🇨🇨",
        },
        {
          code: "CD",
          unicode: "U+1F1E8 U+1F1E9",
          name: "Congo - Kinshasa",
          emoji: "🇨🇩",
        },
        {
          code: "CF",
          unicode: "U+1F1E8 U+1F1EB",
          name: "Central African Republic",
          emoji: "🇨🇫",
        },
        {
          code: "CG",
          unicode: "U+1F1E8 U+1F1EC",
          name: "Congo - Brazzaville",
          emoji: "🇨🇬",
        },
        {
          code: "CH",
          unicode: "U+1F1E8 U+1F1ED",
          name: "Switzerland",
          emoji: "🇨🇭",
        },
        {
          code: "CI",
          unicode: "U+1F1E8 U+1F1EE",
          name: "Côte d’Ivoire",
          emoji: "🇨🇮",
        },
        {
          code: "CK",
          unicode: "U+1F1E8 U+1F1F0",
          name: "Cook Islands",
          emoji: "🇨🇰",
        },
        {
          code: "CL",
          unicode: "U+1F1E8 U+1F1F1",
          name: "Chile",
          emoji: "🇨🇱",
        },
        {
          code: "CM",
          unicode: "U+1F1E8 U+1F1F2",
          name: "Cameroon",
          emoji: "🇨🇲",
        },
        {
          code: "CN",
          unicode: "U+1F1E8 U+1F1F3",
          name: "China",
          emoji: "🇨🇳",
        },
        {
          code: "CO",
          unicode: "U+1F1E8 U+1F1F4",
          name: "Colombia",
          emoji: "🇨🇴",
        },
        {
          code: "CP",
          unicode: "U+1F1E8 U+1F1F5",
          name: "Clipperton Island",
          emoji: "🇨🇵",
        },
        {
          code: "CR",
          unicode: "U+1F1E8 U+1F1F7",
          name: "Costa Rica",
          emoji: "🇨🇷",
        },
        {
          code: "CU",
          unicode: "U+1F1E8 U+1F1FA",
          name: "Cuba",
          emoji: "🇨🇺",
        },
        {
          code: "CV",
          unicode: "U+1F1E8 U+1F1FB",
          name: "Cape Verde",
          emoji: "🇨🇻",
        },
        {
          code: "CW",
          unicode: "U+1F1E8 U+1F1FC",
          name: "Curaçao",
          emoji: "🇨🇼",
        },
        {
          code: "CX",
          unicode: "U+1F1E8 U+1F1FD",
          name: "Christmas Island",
          emoji: "🇨🇽",
        },
        {
          code: "CY",
          unicode: "U+1F1E8 U+1F1FE",
          name: "Cyprus",
          emoji: "🇨🇾",
        },
        {
          code: "CZ",
          unicode: "U+1F1E8 U+1F1FF",
          name: "Czechia",
          emoji: "🇨🇿",
        },
        {
          code: "DE",
          unicode: "U+1F1E9 U+1F1EA",
          name: "Germany",
          emoji: "🇩🇪",
        },
        {
          code: "DG",
          unicode: "U+1F1E9 U+1F1EC",
          name: "Diego Garcia",
          emoji: "🇩🇬",
        },
        {
          code: "DJ",
          unicode: "U+1F1E9 U+1F1EF",
          name: "Djibouti",
          emoji: "🇩🇯",
        },
        {
          code: "DK",
          unicode: "U+1F1E9 U+1F1F0",
          name: "Denmark",
          emoji: "🇩🇰",
        },
        {
          code: "DM",
          unicode: "U+1F1E9 U+1F1F2",
          name: "Dominica",
          emoji: "🇩🇲",
        },
        {
          code: "DO",
          unicode: "U+1F1E9 U+1F1F4",
          name: "Dominican Republic",
          emoji: "🇩🇴",
        },
        {
          code: "DZ",
          unicode: "U+1F1E9 U+1F1FF",
          name: "Algeria",
          emoji: "🇩🇿",
        },
        {
          code: "EA",
          unicode: "U+1F1EA U+1F1E6",
          name: "Ceuta & Melilla",
          emoji: "🇪🇦",
        },
        {
          code: "EC",
          unicode: "U+1F1EA U+1F1E8",
          name: "Ecuador",
          emoji: "🇪🇨",
        },
        {
          code: "EE",
          unicode: "U+1F1EA U+1F1EA",
          name: "Estonia",
          emoji: "🇪🇪",
        },
        {
          code: "EG",
          unicode: "U+1F1EA U+1F1EC",
          name: "Egypt",
          emoji: "🇪🇬",
        },
        {
          code: "EH",
          unicode: "U+1F1EA U+1F1ED",
          name: "Western Sahara",
          emoji: "🇪🇭",
        },
        {
          code: "ER",
          unicode: "U+1F1EA U+1F1F7",
          name: "Eritrea",
          emoji: "🇪🇷",
        },
        {
          code: "ES",
          unicode: "U+1F1EA U+1F1F8",
          name: "Spain",
          emoji: "🇪🇸",
        },
        {
          code: "ET",
          unicode: "U+1F1EA U+1F1F9",
          name: "Ethiopia",
          emoji: "🇪🇹",
        },
        {
          code: "EU",
          unicode: "U+1F1EA U+1F1FA",
          name: "European Union",
          emoji: "🇪🇺",
        },
        {
          code: "FI",
          unicode: "U+1F1EB U+1F1EE",
          name: "Finland",
          emoji: "🇫🇮",
        },
        {
          code: "FJ",
          unicode: "U+1F1EB U+1F1EF",
          name: "Fiji",
          emoji: "🇫🇯",
        },
        {
          code: "FK",
          unicode: "U+1F1EB U+1F1F0",
          name: "Falkland Islands",
          emoji: "🇫🇰",
        },
        {
          code: "FM",
          unicode: "U+1F1EB U+1F1F2",
          name: "Micronesia",
          emoji: "🇫🇲",
        },
        {
          code: "FO",
          unicode: "U+1F1EB U+1F1F4",
          name: "Faroe Islands",
          emoji: "🇫🇴",
        },
        {
          code: "FR",
          unicode: "U+1F1EB U+1F1F7",
          name: "France",
          emoji: "🇫🇷",
        },
        {
          code: "GA",
          unicode: "U+1F1EC U+1F1E6",
          name: "Gabon",
          emoji: "🇬🇦",
        },
        {
          code: "GB",
          unicode: "U+1F1EC U+1F1E7",
          name: "United Kingdom",
          emoji: "🇬🇧",
        },
        {
          code: "GD",
          unicode: "U+1F1EC U+1F1E9",
          name: "Grenada",
          emoji: "🇬🇩",
        },
        {
          code: "GE",
          unicode: "U+1F1EC U+1F1EA",
          name: "Georgia",
          emoji: "🇬🇪",
        },
        {
          code: "GF",
          unicode: "U+1F1EC U+1F1EB",
          name: "French Guiana",
          emoji: "🇬🇫",
        },
        {
          code: "GG",
          unicode: "U+1F1EC U+1F1EC",
          name: "Guernsey",
          emoji: "🇬🇬",
        },
        {
          code: "GH",
          unicode: "U+1F1EC U+1F1ED",
          name: "Ghana",
          emoji: "🇬🇭",
        },
        {
          code: "GI",
          unicode: "U+1F1EC U+1F1EE",
          name: "Gibraltar",
          emoji: "🇬🇮",
        },
        {
          code: "GL",
          unicode: "U+1F1EC U+1F1F1",
          name: "Greenland",
          emoji: "🇬🇱",
        },
        {
          code: "GM",
          unicode: "U+1F1EC U+1F1F2",
          name: "Gambia",
          emoji: "🇬🇲",
        },
        {
          code: "GN",
          unicode: "U+1F1EC U+1F1F3",
          name: "Guinea",
          emoji: "🇬🇳",
        },
        {
          code: "GP",
          unicode: "U+1F1EC U+1F1F5",
          name: "Guadeloupe",
          emoji: "🇬🇵",
        },
        {
          code: "GQ",
          unicode: "U+1F1EC U+1F1F6",
          name: "Equatorial Guinea",
          emoji: "🇬🇶",
        },
        {
          code: "GR",
          unicode: "U+1F1EC U+1F1F7",
          name: "Greece",
          emoji: "🇬🇷",
        },
        {
          code: "GS",
          unicode: "U+1F1EC U+1F1F8",
          name: "South Georgia & South Sandwich Islands",
          emoji: "🇬🇸",
        },
        {
          code: "GT",
          unicode: "U+1F1EC U+1F1F9",
          name: "Guatemala",
          emoji: "🇬🇹",
        },
        {
          code: "GU",
          unicode: "U+1F1EC U+1F1FA",
          name: "Guam",
          emoji: "🇬🇺",
        },
        {
          code: "GW",
          unicode: "U+1F1EC U+1F1FC",
          name: "Guinea-Bissau",
          emoji: "🇬🇼",
        },
        {
          code: "GY",
          unicode: "U+1F1EC U+1F1FE",
          name: "Guyana",
          emoji: "🇬🇾",
        },
        {
          code: "HK",
          unicode: "U+1F1ED U+1F1F0",
          name: "Hong Kong SAR China",
          emoji: "🇭🇰",
        },
        {
          code: "HM",
          unicode: "U+1F1ED U+1F1F2",
          name: "Heard & McDonald Islands",
          emoji: "🇭🇲",
        },
        {
          code: "HN",
          unicode: "U+1F1ED U+1F1F3",
          name: "Honduras",
          emoji: "🇭🇳",
        },
        {
          code: "HR",
          unicode: "U+1F1ED U+1F1F7",
          name: "Croatia",
          emoji: "🇭🇷",
        },
        {
          code: "HT",
          unicode: "U+1F1ED U+1F1F9",
          name: "Haiti",
          emoji: "🇭🇹",
        },
        {
          code: "HU",
          unicode: "U+1F1ED U+1F1FA",
          name: "Hungary",
          emoji: "🇭🇺",
        },
        {
          code: "IC",
          unicode: "U+1F1EE U+1F1E8",
          name: "Canary Islands",
          emoji: "🇮🇨",
        },
        {
          code: "ID",
          unicode: "U+1F1EE U+1F1E9",
          name: "Indonesia",
          emoji: "🇮🇩",
        },
        {
          code: "IE",
          unicode: "U+1F1EE U+1F1EA",
          name: "Ireland",
          emoji: "🇮🇪",
        },
        {
          code: "IL",
          unicode: "U+1F1EE U+1F1F1",
          name: "Israel",
          emoji: "🇮🇱",
        },
        {
          code: "IM",
          unicode: "U+1F1EE U+1F1F2",
          name: "Isle of Man",
          emoji: "🇮🇲",
        },
        {
          code: "IN",
          unicode: "U+1F1EE U+1F1F3",
          name: "India",
          emoji: "🇮🇳",
        },
        {
          code: "IO",
          unicode: "U+1F1EE U+1F1F4",
          name: "British Indian Ocean Territory",
          emoji: "🇮🇴",
        },
        {
          code: "IQ",
          unicode: "U+1F1EE U+1F1F6",
          name: "Iraq",
          emoji: "🇮🇶",
        },
        {
          code: "IR",
          unicode: "U+1F1EE U+1F1F7",
          name: "Iran",
          emoji: "🇮🇷",
        },
        {
          code: "IS",
          unicode: "U+1F1EE U+1F1F8",
          name: "Iceland",
          emoji: "🇮🇸",
        },
        {
          code: "IT",
          unicode: "U+1F1EE U+1F1F9",
          name: "Italy",
          emoji: "🇮🇹",
        },
        {
          code: "JE",
          unicode: "U+1F1EF U+1F1EA",
          name: "Jersey",
          emoji: "🇯🇪",
        },
        {
          code: "JM",
          unicode: "U+1F1EF U+1F1F2",
          name: "Jamaica",
          emoji: "🇯🇲",
        },
        {
          code: "JO",
          unicode: "U+1F1EF U+1F1F4",
          name: "Jordan",
          emoji: "🇯🇴",
        },
        {
          code: "JP",
          unicode: "U+1F1EF U+1F1F5",
          name: "Japan",
          emoji: "🇯🇵",
        },
        {
          code: "KE",
          unicode: "U+1F1F0 U+1F1EA",
          name: "Kenya",
          emoji: "🇰🇪",
        },
        {
          code: "KG",
          unicode: "U+1F1F0 U+1F1EC",
          name: "Kyrgyzstan",
          emoji: "🇰🇬",
        },
        {
          code: "KH",
          unicode: "U+1F1F0 U+1F1ED",
          name: "Cambodia",
          emoji: "🇰🇭",
        },
        {
          code: "KI",
          unicode: "U+1F1F0 U+1F1EE",
          name: "Kiribati",
          emoji: "🇰🇮",
        },
        {
          code: "KM",
          unicode: "U+1F1F0 U+1F1F2",
          name: "Comoros",
          emoji: "🇰🇲",
        },
        {
          code: "KN",
          unicode: "U+1F1F0 U+1F1F3",
          name: "St. Kitts & Nevis",
          emoji: "🇰🇳",
        },
        {
          code: "KP",
          unicode: "U+1F1F0 U+1F1F5",
          name: "North Korea",
          emoji: "🇰🇵",
        },
        {
          code: "KR",
          unicode: "U+1F1F0 U+1F1F7",
          name: "South Korea",
          emoji: "🇰🇷",
        },
        {
          code: "KW",
          unicode: "U+1F1F0 U+1F1FC",
          name: "Kuwait",
          emoji: "🇰🇼",
        },
        {
          code: "KY",
          unicode: "U+1F1F0 U+1F1FE",
          name: "Cayman Islands",
          emoji: "🇰🇾",
        },
        {
          code: "KZ",
          unicode: "U+1F1F0 U+1F1FF",
          name: "Kazakhstan",
          emoji: "🇰🇿",
        },
        {
          code: "LA",
          unicode: "U+1F1F1 U+1F1E6",
          name: "Laos",
          emoji: "🇱🇦",
        },
        {
          code: "LB",
          unicode: "U+1F1F1 U+1F1E7",
          name: "Lebanon",
          emoji: "🇱🇧",
        },
        {
          code: "LC",
          unicode: "U+1F1F1 U+1F1E8",
          name: "St. Lucia",
          emoji: "🇱🇨",
        },
        {
          code: "LI",
          unicode: "U+1F1F1 U+1F1EE",
          name: "Liechtenstein",
          emoji: "🇱🇮",
        },
        {
          code: "LK",
          unicode: "U+1F1F1 U+1F1F0",
          name: "Sri Lanka",
          emoji: "🇱🇰",
        },
        {
          code: "LR",
          unicode: "U+1F1F1 U+1F1F7",
          name: "Liberia",
          emoji: "🇱🇷",
        },
        {
          code: "LS",
          unicode: "U+1F1F1 U+1F1F8",
          name: "Lesotho",
          emoji: "🇱🇸",
        },
        {
          code: "LT",
          unicode: "U+1F1F1 U+1F1F9",
          name: "Lithuania",
          emoji: "🇱🇹",
        },
        {
          code: "LU",
          unicode: "U+1F1F1 U+1F1FA",
          name: "Luxembourg",
          emoji: "🇱🇺",
        },
        {
          code: "LV",
          unicode: "U+1F1F1 U+1F1FB",
          name: "Latvia",
          emoji: "🇱🇻",
        },
        {
          code: "LY",
          unicode: "U+1F1F1 U+1F1FE",
          name: "Libya",
          emoji: "🇱🇾",
        },
        {
          code: "MA",
          unicode: "U+1F1F2 U+1F1E6",
          name: "Morocco",
          emoji: "🇲🇦",
        },
        {
          code: "MC",
          unicode: "U+1F1F2 U+1F1E8",
          name: "Monaco",
          emoji: "🇲🇨",
        },
        {
          code: "MD",
          unicode: "U+1F1F2 U+1F1E9",
          name: "Moldova",
          emoji: "🇲🇩",
        },
        {
          code: "ME",
          unicode: "U+1F1F2 U+1F1EA",
          name: "Montenegro",
          emoji: "🇲🇪",
        },
        {
          code: "MF",
          unicode: "U+1F1F2 U+1F1EB",
          name: "St. Martin",
          emoji: "🇲🇫",
        },
        {
          code: "MG",
          unicode: "U+1F1F2 U+1F1EC",
          name: "Madagascar",
          emoji: "🇲🇬",
        },
        {
          code: "MH",
          unicode: "U+1F1F2 U+1F1ED",
          name: "Marshall Islands",
          emoji: "🇲🇭",
        },
        {
          code: "MK",
          unicode: "U+1F1F2 U+1F1F0",
          name: "Macedonia",
          emoji: "🇲🇰",
        },
        {
          code: "ML",
          unicode: "U+1F1F2 U+1F1F1",
          name: "Mali",
          emoji: "🇲🇱",
        },
        {
          code: "MM",
          unicode: "U+1F1F2 U+1F1F2",
          name: "Myanmar (Burma)",
          emoji: "🇲🇲",
        },
        {
          code: "MN",
          unicode: "U+1F1F2 U+1F1F3",
          name: "Mongolia",
          emoji: "🇲🇳",
        },
        {
          code: "MO",
          unicode: "U+1F1F2 U+1F1F4",
          name: "Macau SAR China",
          emoji: "🇲🇴",
        },
        {
          code: "MP",
          unicode: "U+1F1F2 U+1F1F5",
          name: "Northern Mariana Islands",
          emoji: "🇲🇵",
        },
        {
          code: "MQ",
          unicode: "U+1F1F2 U+1F1F6",
          name: "Martinique",
          emoji: "🇲🇶",
        },
        {
          code: "MR",
          unicode: "U+1F1F2 U+1F1F7",
          name: "Mauritania",
          emoji: "🇲🇷",
        },
        {
          code: "MS",
          unicode: "U+1F1F2 U+1F1F8",
          name: "Montserrat",
          emoji: "🇲🇸",
        },
        {
          code: "MT",
          unicode: "U+1F1F2 U+1F1F9",
          name: "Malta",
          emoji: "🇲🇹",
        },
        {
          code: "MU",
          unicode: "U+1F1F2 U+1F1FA",
          name: "Mauritius",
          emoji: "🇲🇺",
        },
        {
          code: "MV",
          unicode: "U+1F1F2 U+1F1FB",
          name: "Maldives",
          emoji: "🇲🇻",
        },
        {
          code: "MW",
          unicode: "U+1F1F2 U+1F1FC",
          name: "Malawi",
          emoji: "🇲🇼",
        },
        {
          code: "MX",
          unicode: "U+1F1F2 U+1F1FD",
          name: "Mexico",
          emoji: "🇲🇽",
        },
        {
          code: "MY",
          unicode: "U+1F1F2 U+1F1FE",
          name: "Malaysia",
          emoji: "🇲🇾",
        },
        {
          code: "MZ",
          unicode: "U+1F1F2 U+1F1FF",
          name: "Mozambique",
          emoji: "🇲🇿",
        },
        {
          code: "NA",
          unicode: "U+1F1F3 U+1F1E6",
          name: "Namibia",
          emoji: "🇳🇦",
        },
        {
          code: "NC",
          unicode: "U+1F1F3 U+1F1E8",
          name: "New Caledonia",
          emoji: "🇳🇨",
        },
        {
          code: "NE",
          unicode: "U+1F1F3 U+1F1EA",
          name: "Niger",
          emoji: "🇳🇪",
        },
        {
          code: "NF",
          unicode: "U+1F1F3 U+1F1EB",
          name: "Norfolk Island",
          emoji: "🇳🇫",
        },
        {
          code: "NG",
          unicode: "U+1F1F3 U+1F1EC",
          name: "Nigeria",
          emoji: "🇳🇬",
        },
        {
          code: "NI",
          unicode: "U+1F1F3 U+1F1EE",
          name: "Nicaragua",
          emoji: "🇳🇮",
        },
        {
          code: "NL",
          unicode: "U+1F1F3 U+1F1F1",
          name: "Netherlands",
          emoji: "🇳🇱",
        },
        {
          code: "NO",
          unicode: "U+1F1F3 U+1F1F4",
          name: "Norway",
          emoji: "🇳🇴",
        },
        {
          code: "NP",
          unicode: "U+1F1F3 U+1F1F5",
          name: "Nepal",
          emoji: "🇳🇵",
        },
        {
          code: "NR",
          unicode: "U+1F1F3 U+1F1F7",
          name: "Nauru",
          emoji: "🇳🇷",
        },
        {
          code: "NU",
          unicode: "U+1F1F3 U+1F1FA",
          name: "Niue",
          emoji: "🇳🇺",
        },
        {
          code: "NZ",
          unicode: "U+1F1F3 U+1F1FF",
          name: "New Zealand",
          emoji: "🇳🇿",
        },
        {
          code: "OM",
          unicode: "U+1F1F4 U+1F1F2",
          name: "Oman",
          emoji: "🇴🇲",
        },
        {
          code: "PA",
          unicode: "U+1F1F5 U+1F1E6",
          name: "Panama",
          emoji: "🇵🇦",
        },
        {
          code: "PE",
          unicode: "U+1F1F5 U+1F1EA",
          name: "Peru",
          emoji: "🇵🇪",
        },
        {
          code: "PF",
          unicode: "U+1F1F5 U+1F1EB",
          name: "French Polynesia",
          emoji: "🇵🇫",
        },
        {
          code: "PG",
          unicode: "U+1F1F5 U+1F1EC",
          name: "Papua New Guinea",
          emoji: "🇵🇬",
        },
        {
          code: "PH",
          unicode: "U+1F1F5 U+1F1ED",
          name: "Philippines",
          emoji: "🇵🇭",
        },
        {
          code: "PK",
          unicode: "U+1F1F5 U+1F1F0",
          name: "Pakistan",
          emoji: "🇵🇰",
        },
        {
          code: "PL",
          unicode: "U+1F1F5 U+1F1F1",
          name: "Poland",
          emoji: "🇵🇱",
        },
        {
          code: "PM",
          unicode: "U+1F1F5 U+1F1F2",
          name: "St. Pierre & Miquelon",
          emoji: "🇵🇲",
        },
        {
          code: "PN",
          unicode: "U+1F1F5 U+1F1F3",
          name: "Pitcairn Islands",
          emoji: "🇵🇳",
        },
        {
          code: "PR",
          unicode: "U+1F1F5 U+1F1F7",
          name: "Puerto Rico",
          emoji: "🇵🇷",
        },
        {
          code: "PS",
          unicode: "U+1F1F5 U+1F1F8",
          name: "Palestinian Territories",
          emoji: "🇵🇸",
        },
        {
          code: "PT",
          unicode: "U+1F1F5 U+1F1F9",
          name: "Portugal",
          emoji: "🇵🇹",
        },
        {
          code: "PW",
          unicode: "U+1F1F5 U+1F1FC",
          name: "Palau",
          emoji: "🇵🇼",
        },
        {
          code: "PY",
          unicode: "U+1F1F5 U+1F1FE",
          name: "Paraguay",
          emoji: "🇵🇾",
        },
        {
          code: "QA",
          unicode: "U+1F1F6 U+1F1E6",
          name: "Qatar",
          emoji: "🇶🇦",
        },
        {
          code: "RE",
          unicode: "U+1F1F7 U+1F1EA",
          name: "Réunion",
          emoji: "🇷🇪",
        },
        {
          code: "RO",
          unicode: "U+1F1F7 U+1F1F4",
          name: "Romania",
          emoji: "🇷🇴",
        },
        {
          code: "RS",
          unicode: "U+1F1F7 U+1F1F8",
          name: "Serbia",
          emoji: "🇷🇸",
        },
        {
          code: "RU",
          unicode: "U+1F1F7 U+1F1FA",
          name: "Russia",
          emoji: "🇷🇺",
        },
        {
          code: "RW",
          unicode: "U+1F1F7 U+1F1FC",
          name: "Rwanda",
          emoji: "🇷🇼",
        },
        {
          code: "SA",
          unicode: "U+1F1F8 U+1F1E6",
          name: "Saudi Arabia",
          emoji: "🇸🇦",
        },
        {
          code: "SB",
          unicode: "U+1F1F8 U+1F1E7",
          name: "Solomon Islands",
          emoji: "🇸🇧",
        },
        {
          code: "SC",
          unicode: "U+1F1F8 U+1F1E8",
          name: "Seychelles",
          emoji: "🇸🇨",
        },
        {
          code: "SD",
          unicode: "U+1F1F8 U+1F1E9",
          name: "Sudan",
          emoji: "🇸🇩",
        },
        {
          code: "SE",
          unicode: "U+1F1F8 U+1F1EA",
          name: "Sweden",
          emoji: "🇸🇪",
        },
        {
          code: "SG",
          unicode: "U+1F1F8 U+1F1EC",
          name: "Singapore",
          emoji: "🇸🇬",
        },
        {
          code: "SH",
          unicode: "U+1F1F8 U+1F1ED",
          name: "St. Helena",
          emoji: "🇸🇭",
        },
        {
          code: "SI",
          unicode: "U+1F1F8 U+1F1EE",
          name: "Slovenia",
          emoji: "🇸🇮",
        },
        {
          code: "SJ",
          unicode: "U+1F1F8 U+1F1EF",
          name: "Svalbard & Jan Mayen",
          emoji: "🇸🇯",
        },
        {
          code: "SK",
          unicode: "U+1F1F8 U+1F1F0",
          name: "Slovakia",
          emoji: "🇸🇰",
        },
        {
          code: "SL",
          unicode: "U+1F1F8 U+1F1F1",
          name: "Sierra Leone",
          emoji: "🇸🇱",
        },
        {
          code: "SM",
          unicode: "U+1F1F8 U+1F1F2",
          name: "San Marino",
          emoji: "🇸🇲",
        },
        {
          code: "SN",
          unicode: "U+1F1F8 U+1F1F3",
          name: "Senegal",
          emoji: "🇸🇳",
        },
        {
          code: "SO",
          unicode: "U+1F1F8 U+1F1F4",
          name: "Somalia",
          emoji: "🇸🇴",
        },
        {
          code: "SR",
          unicode: "U+1F1F8 U+1F1F7",
          name: "Suriname",
          emoji: "🇸🇷",
        },
        {
          code: "SS",
          unicode: "U+1F1F8 U+1F1F8",
          name: "South Sudan",
          emoji: "🇸🇸",
        },
        {
          code: "ST",
          unicode: "U+1F1F8 U+1F1F9",
          name: "São Tomé & Príncipe",
          emoji: "🇸🇹",
        },
        {
          code: "SV",
          unicode: "U+1F1F8 U+1F1FB",
          name: "El Salvador",
          emoji: "🇸🇻",
        },
        {
          code: "SX",
          unicode: "U+1F1F8 U+1F1FD",
          name: "Sint Maarten",
          emoji: "🇸🇽",
        },
        {
          code: "SY",
          unicode: "U+1F1F8 U+1F1FE",
          name: "Syria",
          emoji: "🇸🇾",
        },
        {
          code: "SZ",
          unicode: "U+1F1F8 U+1F1FF",
          name: "Swaziland",
          emoji: "🇸🇿",
        },
        {
          code: "TA",
          unicode: "U+1F1F9 U+1F1E6",
          name: "Tristan da Cunha",
          emoji: "🇹🇦",
        },
        {
          code: "TC",
          unicode: "U+1F1F9 U+1F1E8",
          name: "Turks & Caicos Islands",
          emoji: "🇹🇨",
        },
        {
          code: "TD",
          unicode: "U+1F1F9 U+1F1E9",
          name: "Chad",
          emoji: "🇹🇩",
        },
        {
          code: "TF",
          unicode: "U+1F1F9 U+1F1EB",
          name: "French Southern Territories",
          emoji: "🇹🇫",
        },
        {
          code: "TG",
          unicode: "U+1F1F9 U+1F1EC",
          name: "Togo",
          emoji: "🇹🇬",
        },
        {
          code: "TH",
          unicode: "U+1F1F9 U+1F1ED",
          name: "Thailand",
          emoji: "🇹🇭",
        },
        {
          code: "TJ",
          unicode: "U+1F1F9 U+1F1EF",
          name: "Tajikistan",
          emoji: "🇹🇯",
        },
        {
          code: "TK",
          unicode: "U+1F1F9 U+1F1F0",
          name: "Tokelau",
          emoji: "🇹🇰",
        },
        {
          code: "TL",
          unicode: "U+1F1F9 U+1F1F1",
          name: "Timor-Leste",
          emoji: "🇹🇱",
        },
        {
          code: "TM",
          unicode: "U+1F1F9 U+1F1F2",
          name: "Turkmenistan",
          emoji: "🇹🇲",
        },
        {
          code: "TN",
          unicode: "U+1F1F9 U+1F1F3",
          name: "Tunisia",
          emoji: "🇹🇳",
        },
        {
          code: "TO",
          unicode: "U+1F1F9 U+1F1F4",
          name: "Tonga",
          emoji: "🇹🇴",
        },
        {
          code: "TR",
          unicode: "U+1F1F9 U+1F1F7",
          name: "Turkey",
          emoji: "🇹🇷",
        },
        {
          code: "TT",
          unicode: "U+1F1F9 U+1F1F9",
          name: "Trinidad & Tobago",
          emoji: "🇹🇹",
        },
        {
          code: "TV",
          unicode: "U+1F1F9 U+1F1FB",
          name: "Tuvalu",
          emoji: "🇹🇻",
        },
        {
          code: "TW",
          unicode: "U+1F1F9 U+1F1FC",
          name: "Taiwan",
          emoji: "🇹🇼",
        },
        {
          code: "TZ",
          unicode: "U+1F1F9 U+1F1FF",
          name: "Tanzania",
          emoji: "🇹🇿",
        },
        {
          code: "UA",
          unicode: "U+1F1FA U+1F1E6",
          name: "Ukraine",
          emoji: "🇺🇦",
        },
        {
          code: "UG",
          unicode: "U+1F1FA U+1F1EC",
          name: "Uganda",
          emoji: "🇺🇬",
        },
        {
          code: "UM",
          unicode: "U+1F1FA U+1F1F2",
          name: "U.S. Outlying Islands",
          emoji: "🇺🇲",
        },
        {
          code: "UN",
          unicode: "U+1F1FA U+1F1F3",
          name: "United Nations",
          emoji: "🇺🇳",
        },
        {
          code: "US",
          unicode: "U+1F1FA U+1F1F8",
          name: "United States",
          emoji: "🇺🇸",
        },
        {
          code: "UY",
          unicode: "U+1F1FA U+1F1FE",
          name: "Uruguay",
          emoji: "🇺🇾",
        },
        {
          code: "UZ",
          unicode: "U+1F1FA U+1F1FF",
          name: "Uzbekistan",
          emoji: "🇺🇿",
        },
        {
          code: "VA",
          unicode: "U+1F1FB U+1F1E6",
          name: "Vatican City",
          emoji: "🇻🇦",
        },
        {
          code: "VC",
          unicode: "U+1F1FB U+1F1E8",
          name: "St. Vincent & Grenadines",
          emoji: "🇻🇨",
        },
        {
          code: "VE",
          unicode: "U+1F1FB U+1F1EA",
          name: "Venezuela",
          emoji: "🇻🇪",
        },
        {
          code: "VG",
          unicode: "U+1F1FB U+1F1EC",
          name: "British Virgin Islands",
          emoji: "🇻🇬",
        },
        {
          code: "VI",
          unicode: "U+1F1FB U+1F1EE",
          name: "U.S. Virgin Islands",
          emoji: "🇻🇮",
        },
        {
          code: "VN",
          unicode: "U+1F1FB U+1F1F3",
          name: "Vietnam",
          emoji: "🇻🇳",
        },
        {
          code: "VU",
          unicode: "U+1F1FB U+1F1FA",
          name: "Vanuatu",
          emoji: "🇻🇺",
        },
        {
          code: "WF",
          unicode: "U+1F1FC U+1F1EB",
          name: "Wallis & Futuna",
          emoji: "🇼🇫",
        },
        {
          code: "WS",
          unicode: "U+1F1FC U+1F1F8",
          name: "Samoa",
          emoji: "🇼🇸",
        },
        {
          code: "XK",
          unicode: "U+1F1FD U+1F1F0",
          name: "Kosovo",
          emoji: "🇽🇰",
        },
        {
          code: "YE",
          unicode: "U+1F1FE U+1F1EA",
          name: "Yemen",
          emoji: "🇾🇪",
        },
        {
          code: "YT",
          unicode: "U+1F1FE U+1F1F9",
          name: "Mayotte",
          emoji: "🇾🇹",
        },
        {
          code: "ZA",
          unicode: "U+1F1FF U+1F1E6",
          name: "South Africa",
          emoji: "🇿🇦",
        },
        {
          code: "ZM",
          unicode: "U+1F1FF U+1F1F2",
          name: "Zambia",
          emoji: "🇿🇲",
        },
        {
          code: "ZW",
          unicode: "U+1F1FF U+1F1FC",
          name: "Zimbabwe",
          emoji: "🇿🇼",
        },
      ],
      numbers: [],
      arCountry: [
        {
          code: "AD",
          name: "أندورا",
          dialCode: "+376",
        },
        {
          code: "AE",
          name: "الامارات العربية",
          dialCode: "+971",
        },
        {
          code: "AF",
          name: "أفغانستان",
          dialCode: "+93",
        },
        {
          code: "AG",
          name: "أنتيجوا وبربودا",
          dialCode: "+1",
        },
        {
          code: "AI",
          name: "أنجويلا",
          dialCode: "+1",
        },
        {
          code: "AL",
          name: "ألبانيا",
          dialCode: "+355",
        },
        {
          code: "AM",
          name: "أرمينيا",
          dialCode: "+374",
        },
        {
          code: "AO",
          name: "أنجولا",
          dialCode: "+244",
        },
        {
          code: "AQ",
          name: "القطب الجنوبي",
          dialCode: "+672",
        },
        {
          code: "AR",
          name: "الأرجنتين",
          dialCode: "+54",
        },
        {
          code: "AS",
          name: "ساموا الأمريكية",
          dialCode: "+1",
        },
        {
          code: "AT",
          name: "النمسا",
          dialCode: "+43",
        },
        {
          code: "AU",
          name: "أستراليا",
          dialCode: "+61",
        },
        {
          code: "AW",
          name: "آروبا",
          dialCode: "+297",
        },
        {
          code: "AX",
          name: "جزر أولان",
          dialCode: "+358",
        },
        {
          code: "AZ",
          name: "أذربيجان",
          dialCode: "+994",
        },
        {
          code: "BA",
          name: "البوسنة والهرسك",
          dialCode: "+387",
        },
        {
          code: "BB",
          name: "بربادوس",
          dialCode: "+1",
        },
        {
          code: "BD",
          name: "بنجلاديش",
          dialCode: "+880",
        },
        {
          code: "BE",
          name: "بلجيكا",
          dialCode: "+32",
        },
        {
          code: "BF",
          name: "بوركينا فاسو",
          dialCode: "+226",
        },
        {
          code: "BG",
          name: "بلغاريا",
          dialCode: "+359",
        },
        {
          code: "BH",
          name: "البحرين",
          dialCode: "+973",
        },
        {
          code: "BI",
          name: "بوروندي",
          dialCode: "+257",
        },
        {
          code: "BJ",
          name: "بنين",
          dialCode: "+229",
        },
        {
          code: "BL",
          name: "سان بارتيلمي",
          dialCode: "+590",
        },
        {
          code: "BM",
          name: "برمودا",
          dialCode: "+1",
        },
        {
          code: "BN",
          name: "بروناي",
          dialCode: "+673",
        },
        {
          code: "BO",
          name: "بوليفيا",
          dialCode: "+591",
        },
        {
          code: "BQ",
          name: "بونير",
          dialCode: "+599",
        },
        {
          code: "BR",
          name: "البرازيل",
          dialCode: "+55",
        },
        {
          code: "BS",
          name: "الباهاما",
          dialCode: "+1",
        },
        {
          code: "BT",
          name: "بوتان",
          dialCode: "+975",
        },
        {
          code: "BV",
          name: "جزيرة بوفيه",
          dialCode: "+47",
        },
        {
          code: "BW",
          name: "بتسوانا",
          dialCode: "+267",
        },
        {
          code: "BY",
          name: "روسيا البيضاء",
          dialCode: "+375",
        },
        {
          code: "BZ",
          name: "بليز",
          dialCode: "+501",
        },
        {
          code: "CA",
          name: "كندا",
          dialCode: "+1",
        },
        {
          code: "CC",
          name: "جزر كوكوس",
          dialCode: "+61",
        },
        {
          code: "CD",
          name: "الكونغو",
          dialCode: "+243",
        },
        {
          code: "CF",
          name: "افريقيا الوسطى",
          dialCode: "+236",
        },
        {
          code: "CG",
          name: "الكونغو - برازافيل",
          dialCode: "+242",
        },
        {
          code: "CH",
          name: "سويسرا",
          dialCode: "+41",
        },
        {
          code: "CI",
          name: "ساحل العاج",
          dialCode: "+225",
        },
        {
          code: "CK",
          name: "جزر كوك",
          dialCode: "+682",
        },
        {
          code: "CL",
          name: "شيلي",
          dialCode: "+56",
        },
        {
          code: "CM",
          name: "الكاميرون",
          dialCode: "+237",
        },
        {
          code: "CN",
          name: "الصين",
          dialCode: "+86",
        },
        {
          code: "CO",
          name: "كولومبيا",
          dialCode: "+57",
        },
        {
          code: "CR",
          name: "كوستاريكا",
          dialCode: "+506",
        },
        {
          code: "CU",
          name: "كوبا",
          dialCode: "+53",
        },
        {
          code: "CV",
          name: "الرأس الأخضر",
          dialCode: "+238",
        },
        {
          code: "CW",
          name: "كوراساو",
          dialCode: "+599",
        },
        {
          code: "CX",
          name: "جزيرة الكريسماس",
          dialCode: "+61",
        },
        {
          code: "CY",
          name: "قبرص",
          dialCode: "+357",
        },
        {
          code: "CZ",
          name: "جمهورية التشيك",
          dialCode: "+420",
        },
        {
          code: "DE",
          name: "ألمانيا",
          dialCode: "+49",
        },
        {
          code: "DJ",
          name: "جيبوتي",
          dialCode: "+253",
        },
        {
          code: "DK",
          name: "الدانمرك",
          dialCode: "+45",
        },
        {
          code: "DM",
          name: "دومينيكا",
          dialCode: "+1",
        },
        {
          code: "DO",
          name: "جمهورية الدومينيك",
          dialCode: "+1",
        },
        {
          code: "DZ",
          name: "الجزائر",
          dialCode: "+213",
        },
        {
          code: "EC",
          name: "الاكوادور",
          dialCode: "+593",
        },
        {
          code: "EE",
          name: "استونيا",
          dialCode: "+372",
        },
        {
          code: "EG",
          name: "مصر",
          dialCode: "+20",
        },
        {
          code: "EH",
          name: "الصحراء الغربية",
          dialCode: "+212",
        },
        {
          code: "ER",
          name: "اريتريا",
          dialCode: "+291",
        },
        {
          code: "ES",
          name: "أسبانيا",
          dialCode: "+34",
        },
        {
          code: "ET",
          name: "اثيوبيا",
          dialCode: "+251",
        },
        {
          code: "FI",
          name: "فنلندا",
          dialCode: "+358",
        },
        {
          code: "FJ",
          name: "فيجي",
          dialCode: "+679",
        },
        {
          code: "FK",
          name: "جزر فوكلاند",
          dialCode: "+500",
        },
        {
          code: "FM",
          name: "ميكرونيزيا",
          dialCode: "+691",
        },
        {
          code: "FO",
          name: "جزر فارو",
          dialCode: "+298",
        },
        {
          code: "FR",
          name: "فرنسا",
          dialCode: "+33",
        },
        {
          code: "GA",
          name: "الجابون",
          dialCode: "+241",
        },
        {
          code: "GB",
          name: "المملكة المتحدة",
          dialCode: "+44",
        },
        {
          code: "GD",
          name: "جرينادا",
          dialCode: "+1",
        },
        {
          code: "GE",
          name: "جورجيا",
          dialCode: "+995",
        },
        {
          code: "GF",
          name: "غويانا",
          dialCode: "+594",
        },
        {
          code: "GG",
          name: "غيرنزي",
          dialCode: "+44",
        },
        {
          code: "GH",
          name: "غانا",
          dialCode: "+233",
        },
        {
          code: "GI",
          name: "جبل طارق",
          dialCode: "+350",
        },
        {
          code: "GL",
          name: "جرينلاند",
          dialCode: "+299",
        },
        {
          code: "GM",
          name: "غامبيا",
          dialCode: "+220",
        },
        {
          code: "GN",
          name: "غينيا",
          dialCode: "+224",
        },
        {
          code: "GP",
          name: "جوادلوب",
          dialCode: "+590",
        },
        {
          code: "GQ",
          name: "غينيا الاستوائية",
          dialCode: "+240",
        },
        {
          code: "GR",
          name: "اليونان",
          dialCode: "+30",
        },
        {
          code: "GS",
          name: "جورجيا الجنوبية",
          dialCode: "+500",
        },
        {
          code: "GT",
          name: "جواتيمالا",
          dialCode: "+502",
        },
        {
          code: "GU",
          name: "جوام",
          dialCode: "+1",
        },
        {
          code: "GW",
          name: "غينيا بيساو",
          dialCode: "+245",
        },
        {
          code: "GY",
          name: "غيانا",
          dialCode: "+595",
        },
        {
          code: "HK",
          name: "هونج كونج الصينية",
          dialCode: "+852",
        },
        {
          code: "HM",
          name: "هيرد وماكدونالد",
          dialCode: "",
        },
        {
          code: "HN",
          name: "هندوراس",
          dialCode: "+504",
        },
        {
          code: "HR",
          name: "كرواتيا",
          dialCode: "+385",
        },
        {
          code: "HT",
          name: "هايتي",
          dialCode: "+509",
        },
        {
          code: "HU",
          name: "المجر",
          dialCode: "+36",
        },
        {
          code: "ID",
          name: "اندونيسيا",
          dialCode: "+62",
        },
        {
          code: "IE",
          name: "أيرلندا",
          dialCode: "+353",
        },
        {
          code: "IL",
          name: "اسرائيل",
          dialCode: "+972",
        },
        {
          code: "IM",
          name: "جزيرة مان",
          dialCode: "+44",
        },
        {
          code: "IN",
          name: "الهند",
          dialCode: "+91",
        },
        {
          code: "IO",
          name: "المحيط الهندي البريطاني",
          dialCode: "+246",
        },
        {
          code: "IQ",
          name: "العراق",
          dialCode: "+964",
        },
        {
          code: "IR",
          name: "ايران",
          dialCode: "+98",
        },
        {
          code: "IS",
          name: "أيسلندا",
          dialCode: "+354",
        },
        {
          code: "IT",
          name: "ايطاليا",
          dialCode: "+39",
        },
        {
          code: "JE",
          name: "جيرسي",
          dialCode: "+44",
        },
        {
          code: "JM",
          name: "جامايكا",
          dialCode: "+1",
        },
        {
          code: "JO",
          name: "الأردن",
          dialCode: "+962",
        },
        {
          code: "JP",
          name: "اليابان",
          dialCode: "+81",
        },
        {
          code: "KE",
          name: "كينيا",
          dialCode: "+254",
        },
        {
          code: "KG",
          name: "قرغيزستان",
          dialCode: "+996",
        },
        {
          code: "KH",
          name: "كمبوديا",
          dialCode: "+855",
        },
        {
          code: "KI",
          name: "كيريباتي",
          dialCode: "+686",
        },
        {
          code: "KM",
          name: "جزر القمر",
          dialCode: "+269",
        },
        {
          code: "KN",
          name: "سانت كيتس",
          dialCode: "+1",
        },
        {
          code: "KP",
          name: "كوريا الشمالية",
          dialCode: "+850",
        },
        {
          code: "KR",
          name: "كوريا الجنوبية",
          dialCode: "+82",
        },
        {
          code: "KW",
          name: "الكويت",
          dialCode: "+965",
        },
        {
          code: "KY",
          name: "جزر الكايمن",
          dialCode: "+345",
        },
        {
          code: "KZ",
          name: "كازاخستان",
          dialCode: "+7",
        },
        {
          code: "LA",
          name: "لاوس",
          dialCode: "+856",
        },
        {
          code: "LB",
          name: "لبنان",
          dialCode: "+961",
        },
        {
          code: "LC",
          name: "سانت لوسيا",
          dialCode: "+1",
        },
        {
          code: "LI",
          name: "ليختنشتاين",
          dialCode: "+423",
        },
        {
          code: "LK",
          name: "سريلانكا",
          dialCode: "+94",
        },
        {
          code: "LR",
          name: "ليبيريا",
          dialCode: "+231",
        },
        {
          code: "LS",
          name: "ليسوتو",
          dialCode: "+266",
        },
        {
          code: "LT",
          name: "ليتوانيا",
          dialCode: "+370",
        },
        {
          code: "LU",
          name: "لوكسمبورج",
          dialCode: "+352",
        },
        {
          code: "LV",
          name: "لاتفيا",
          dialCode: "+371",
        },
        {
          code: "LY",
          name: "ليبيا",
          dialCode: "+218",
        },
        {
          code: "MA",
          name: "المغرب",
          dialCode: "+212",
        },
        {
          code: "MC",
          name: "موناكو",
          dialCode: "+377",
        },
        {
          code: "MD",
          name: "مولدافيا",
          dialCode: "+373",
        },
        {
          code: "ME",
          name: "الجبل الأسود",
          dialCode: "+382",
        },
        {
          code: "MF",
          name: "سانت مارتين",
          dialCode: "+590",
        },
        {
          code: "MG",
          name: "مدغشقر",
          dialCode: "+261",
        },
        {
          code: "MH",
          name: "جزر المارشال",
          dialCode: "+692",
        },
        {
          code: "MK",
          name: "مقدونيا",
          dialCode: "+389",
        },
        {
          code: "ML",
          name: "مالي",
          dialCode: "+223",
        },
        {
          code: "MM",
          name: "ميانمار",
          dialCode: "+95",
        },
        {
          code: "MN",
          name: "منغوليا",
          dialCode: "+976",
        },
        {
          code: "MO",
          name: "ماكاو الصينية",
          dialCode: "+853",
        },
        {
          code: "MP",
          name: "جزر ماريانا الشمالية",
          dialCode: "+1",
        },
        {
          code: "MQ",
          name: "مارتينيك",
          dialCode: "+596",
        },
        {
          code: "MR",
          name: "موريتانيا",
          dialCode: "+222",
        },
        {
          code: "MS",
          name: "مونتسرات",
          dialCode: "+1",
        },
        {
          code: "MT",
          name: "مالطا",
          dialCode: "+356",
        },
        {
          code: "MU",
          name: "موريشيوس",
          dialCode: "+230",
        },
        {
          code: "MV",
          name: "جزر الملديف",
          dialCode: "+960",
        },
        {
          code: "MW",
          name: "ملاوي",
          dialCode: "+265",
        },
        {
          code: "MX",
          name: "المكسيك",
          dialCode: "+52",
        },
        {
          code: "MY",
          name: "ماليزيا",
          dialCode: "+60",
        },
        {
          code: "MZ",
          name: "موزمبيق",
          dialCode: "+258",
        },
        {
          code: "NA",
          name: "ناميبيا",
          dialCode: "+264",
        },
        {
          code: "NC",
          name: "كاليدونيا الجديدة",
          dialCode: "+687",
        },
        {
          code: "NE",
          name: "النيجر",
          dialCode: "+227",
        },
        {
          code: "NF",
          name: "نورفوك",
          dialCode: "+672",
        },
        {
          code: "NG",
          name: "نيجيريا",
          dialCode: "+234",
        },
        {
          code: "NI",
          name: "نيكاراجوا",
          dialCode: "+505",
        },
        {
          code: "NL",
          name: "هولندا",
          dialCode: "+31",
        },
        {
          code: "NO",
          name: "النرويج",
          dialCode: "+47",
        },
        {
          code: "NP",
          name: "نيبال",
          dialCode: "+977",
        },
        {
          code: "NR",
          name: "نورو",
          dialCode: "+674",
        },
        {
          code: "NU",
          name: "نيوي",
          dialCode: "+683",
        },
        {
          code: "NZ",
          name: "نيوزيلاندا",
          dialCode: "+64",
        },
        {
          code: "OM",
          name: "عمان",
          dialCode: "+968",
        },
        {
          code: "PA",
          name: "بنما",
          dialCode: "+507",
        },
        {
          code: "PE",
          name: "بيرو",
          dialCode: "+51",
        },
        {
          code: "PF",
          name: "بولينيزيا الفرنسية",
          dialCode: "+689",
        },
        {
          code: "PG",
          name: "بابوا غينيا الجديدة",
          dialCode: "+675",
        },
        {
          code: "PH",
          name: "الفيلبين",
          dialCode: "+63",
        },
        {
          code: "PK",
          name: "باكستان",
          dialCode: "+92",
        },
        {
          code: "PL",
          name: "بولندا",
          dialCode: "+48",
        },
        {
          code: "PM",
          name: "سانت بيير وميكولون",
          dialCode: "+508",
        },
        {
          code: "PN",
          name: "بتكايرن",
          dialCode: "+872",
        },
        {
          code: "PR",
          name: "بورتوريكو",
          dialCode: "+1",
        },
        {
          code: "PS",
          name: "فلسطين",
          dialCode: "+970",
        },
        {
          code: "PT",
          name: "البرتغال",
          dialCode: "+351",
        },
        {
          code: "PW",
          name: "بالاو",
          dialCode: "+680",
        },
        {
          code: "PY",
          name: "باراجواي",
          dialCode: "+595",
        },
        {
          code: "QA",
          name: "قطر",
          dialCode: "+974",
        },
        {
          code: "RE",
          name: "روينيون",
          dialCode: "+262",
        },
        {
          code: "RO",
          name: "رومانيا",
          dialCode: "+40",
        },
        {
          code: "RS",
          name: "صربيا",
          dialCode: "+381",
        },
        {
          code: "RU",
          name: "روسيا",
          dialCode: "+7",
        },
        {
          code: "RW",
          name: "رواندا",
          dialCode: "+250",
        },
        {
          code: "SA",
          name: "السعودية",
          dialCode: "+966",
        },
        {
          code: "SB",
          name: "جزر سليمان",
          dialCode: "+677",
        },
        {
          code: "SC",
          name: "سيشل",
          dialCode: "+248",
        },
        {
          code: "SD",
          name: "السودان",
          dialCode: "+249",
        },
        {
          code: "SE",
          name: "السويد",
          dialCode: "+46",
        },
        {
          code: "SG",
          name: "سنغافورة",
          dialCode: "+65",
        },
        {
          code: "SH",
          name: "سانت هيلنا",
          dialCode: "+290",
        },
        {
          code: "SI",
          name: "سلوفينيا",
          dialCode: "+386",
        },
        {
          code: "SJ",
          name: "سفالبارد وجان مايان",
          dialCode: "+47",
        },
        {
          code: "SK",
          name: "سلوفاكيا",
          dialCode: "+421",
        },
        {
          code: "SL",
          name: "سيراليون",
          dialCode: "+232",
        },
        {
          code: "SM",
          name: "سان مارينو",
          dialCode: "+378",
        },
        {
          code: "SN",
          name: "السنغال",
          dialCode: "+221",
        },
        {
          code: "SO",
          name: "الصومال",
          dialCode: "+252",
        },
        {
          code: "SR",
          name: "سورينام",
          dialCode: "+597",
        },
        {
          code: "SS",
          name: "جنوب السودان",
          dialCode: "+211",
        },
        {
          code: "ST",
          name: "ساو تومي وبرينسيبي",
          dialCode: "+239",
        },
        {
          code: "SV",
          name: "السلفادور",
          dialCode: "+503",
        },
        {
          code: "SX",
          name: "سينت مارتن",
          dialCode: "+1",
        },
        {
          code: "SY",
          name: "سوريا",
          dialCode: "+963",
        },
        {
          code: "SZ",
          name: "سوازيلاند",
          dialCode: "+268",
        },
        {
          code: "TC",
          name: "جزر الترك وجايكوس",
          dialCode: "+1",
        },
        {
          code: "TD",
          name: "تشاد",
          dialCode: "+235",
        },
        {
          code: "TF",
          name: "المقاطعات الفرنسية",
          dialCode: "+262",
        },
        {
          code: "TG",
          name: "توجو",
          dialCode: "+228",
        },
        {
          code: "TH",
          name: "تايلند",
          dialCode: "+66",
        },
        {
          code: "TJ",
          name: "طاجكستان",
          dialCode: "+992",
        },
        {
          code: "TK",
          name: "توكيلو",
          dialCode: "+690",
        },
        {
          code: "TL",
          name: "تيمور الشرقية",
          dialCode: "+670",
        },
        {
          code: "TM",
          name: "تركمانستان",
          dialCode: "+993",
        },
        {
          code: "TN",
          name: "تونس",
          dialCode: "+216",
        },
        {
          code: "TO",
          name: "تونجا",
          dialCode: "+676",
        },
        {
          code: "TR",
          name: "تركيا",
          dialCode: "+90",
        },
        {
          code: "TT",
          name: "ترينيداد وتوباغو",
          dialCode: "+1",
        },
        {
          code: "TV",
          name: "توفالو",
          dialCode: "+688",
        },
        {
          code: "TW",
          name: "تايوان",
          dialCode: "+886",
        },
        {
          code: "TZ",
          name: "تانزانيا",
          dialCode: "+255",
        },
        {
          code: "UA",
          name: "أوكرانيا",
          dialCode: "+380",
        },
        {
          code: "UG",
          name: "أوغندا",
          dialCode: "+256",
        },
        {
          code: "UM",
          name: "جزر الأمريكية",
          dialCode: "",
        },
        {
          code: "US",
          name: "أمريكا",
          dialCode: "+1",
        },
        {
          code: "UY",
          name: "أورجواي",
          dialCode: "+598",
        },
        {
          code: "UZ",
          name: "أوزبكستان",
          dialCode: "+998",
        },
        {
          code: "VA",
          name: "الفاتيكان",
          dialCode: "+379",
        },
        {
          code: "VC",
          name: "سانت فنسنت وغرنادين",
          dialCode: "+1",
        },
        {
          code: "VE",
          name: "فنزويلا",
          dialCode: "+58",
        },
        {
          code: "VG",
          name: "فرجين البريطانية",
          dialCode: "+1",
        },
        {
          code: "VI",
          name: "فرجين الأمريكية",
          dialCode: "+1",
        },
        {
          code: "VN",
          name: "فيتنام",
          dialCode: "+84",
        },
        {
          code: "VU",
          name: "فانواتو",
          dialCode: "+678",
        },
        {
          code: "WF",
          name: "والس وفوتونا",
          dialCode: "+681",
        },
        {
          code: "WS",
          name: "ساموا",
          dialCode: "+685",
        },
        {
          code: "XK",
          name: "كوسوفو",
          dialCode: "+383",
        },
        {
          code: "YE",
          name: "اليمن",
          dialCode: "+967",
        },
        {
          code: "YT",
          name: "مايوت",
          dialCode: "+262",
        },
        {
          code: "ZA",
          name: "جنوب افريقيا",
          dialCode: "+27",
        },
        {
          code: "ZM",
          name: "زامبيا",
          dialCode: "+260",
        },
        {
          code: "ZW",
          name: "زيمبابوي",
          dialCode: "+263",
        },
      ],
      blockedNumber: [],
      showBatteryStatusSwitch: JSON.parse(
        localStorage.getItem(`${this.$route.params.id}_battery`)
      )
        ? JSON.parse(localStorage.getItem(`${this.$route.params.id}_battery`))
        : false,
      hasError: false,
      hasErrorAllow: false,
      errorMessage: "",
      errorMessageAllow: "",
      thisName: "",
      thisNumber: "",
      x: 0,
      y: 0,
      sessionId: localStorage.getItem("session_id"),
      deleteIndex: null,
      title: "",
      allowedNumber: [],
      showAllowedMenu: false,
      deleteAllowIndex: null,
      thisAllowNumber: "",
      thisAllowName: "",
      xAllow: 0,
      yAllow: 0,
      timezoneValue: "",
      timeformatValue: null,
      allowArray: [],
      botRespondArray: [
        {
          name: "us",
          flag: require("../assets/us_flag.svg"),
          value: 0,
        },
        {
          name: "sa",
          flag: require("../assets/sa_flag.svg"),
          value: 0,
        },
        {
          name: "es",
          flag: require("../assets/es_flag.svg"),
          value: 0,
        },
        {
          name: "it",
          flag: require("../assets/it_flag.svg"),
          value: 0,
        },
        {
          name: "pt",
          flag: require("../assets/pt_flag.svg"),
          value: 0,
        },
      ],
      manageList: [
        {
          name: "reply_to_all",
        },
        {
          name: "reply_to_contact_list",
        },
        {
          name: "reply_to_unknown_numbers",
        },
      ],
      manageListValue: "",
      botRespondValue: "",
      settingsArray: [],
      profileImg: "",
      isloaded: true,
      avatarImageLoaded: false,
      timeZoneLoader: true,
      items: [],
      dialogModalErrorNumber: "",
      errorMessageNumber: false,
      planType: "",
      planTypeError: "",
      counteryCodeLang: [],
      showBackword: ""
    };
  },
  computed: {
    autocompleteMenuProps() {
      // default properties copied from the vuetify-autocomplete docs
      let defaultProps = {
        maxHeight: 304,
        contentClass: "secondary--text",
        zIndex: "6",
      };

      if (this.$vuetify.breakpoint.smAndDown) {
        defaultProps.maxHeight = 230;
        defaultProps.top = true;
      }
      return defaultProps;
    },
    options() {
      return {
        duration: 1000,
        offset: 0,
        easing: "linear",
      };
    },
    days() {
      return this.operatingHours.map((item) => {
        if (item.day == 0) {
          return i18n.t(`days_week.sunday`);
        }
        if (item.day == 1) {
          return i18n.t(`days_week.monday`);
        }
        if (item.day == 2) {
          return i18n.t(`days_week.tuesday`);
        }
        if (item.day == 3) {
          return i18n.t(`days_week.wednesday`);
        }
        if (item.day == 4) {
          return i18n.t(`days_week.thursday`);
        }
        if (item.day == 5) {
          return i18n.t(`days_week.friday`);
        }
        if (item.day == 6) {
          return i18n.t(`days_week.saturday`);
        }
      });
    },
    fields() {
      if (!this.model) return [];
      return this.model.map((key) => key || "n/a");
    },
    numbersChecked() {
      if (!this.allowedNumber) return [];
      return this.allowedNumber.map((key) => key || "n/a");
    },
  },
  watch: {
    search(val) {
      if (this.isLoading) return;
      this.isLoading = true;
      let searchData = {
        router: "search_contact",
        search: this.search,
        number_id: this.$route.params.id,
      };
      // Lazily load input items
      this.post(searchData, false)
        // .then(res => res.json())
        .then((res) => {
          if (res.data.search != undefined) {
            this.entries = res.data.search;
            this.showNoData = false;
          } else {
            this.showNoData = true;
            return val;
          }
          return val;
        })
        .catch((err) => {
          err;
        })
        .finally(() => (this.isLoading = false));
    },
    searchAllow(val) {
      if (this.isAllowLoading) return;
      this.isAllowLoading = true;
      let searchData = {
        router: "search_contact",
        search: this.searchAllow,
        number_id: this.$route.params.id,
      };
      // Lazily load input items
      this.post(searchData, false)
        // .then(res => res.json())
        .then((res) => {
          if (res.data.search != undefined) {
            this.allowArray = res.data.search;
            this.showNoData = false;
          } else {
            this.showNoData = true;
            return val;
          }
          return val;
        })
        .catch((err) => {
          err;
        })
        .finally(() => (this.isAllowLoading = false));
    },
  },
  methods: {
    countreyName() {
      if (i18n.locale == "en") {
        this.counteryCodeLang = this.counteryCode;
      }
      if (i18n.locale == "ar") {
        this.counteryCodeLang = this.arCountry;
      }
    },
    getAllContactNumber() {
      let gatNumberData = {
        router: "get_contact",
        number_id: this.$route.params.id,
      };
      this.post(gatNumberData, false).then((response) => {
        this.itemsAllow = response.data.contacts;
        this.items = response.data.contacts;
        this.$store.state.contacts = response.data.contacts;
        this.placeholderNumbers = "";
        if (response.data.message === "no_records") {
          this.errorMessageNumber = true;
          this.dialogModalErrorNumber = i18n.t(
            `dialog_cards_error.qr_session_expired`
          );
        }
      });
    },
    async newEmail(val) {
      if (this.$refs.altEmail.valid) {
        this.$refs.topProgress.start();
        this.newEmailSet = val;
        await this.postSettings();
        this.$refs.topProgress.done();
      }
    },
    async clearTimeZone() {
      this.$refs.topProgress.start();
      this.timezoneValue = "";
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async clearAllowNumberArray() {
      this.$refs.topProgress.start();
      this.allowedNumber = [];
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async clearAllowedCountrey() {
      this.$refs.topProgress.start();
      this.allowCountry = [];
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async clearBlockedCountrey() {
      this.$refs.topProgress.start();
      this.blockValue = [];
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async clearBlockNumberArray() {
      this.$refs.topProgress.start();
      this.model = [];
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async manageChange() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async langSelectChange() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },

    async allowCountreyChange(val) {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async blockCountreyChange() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async blockNumberChange() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async operatingSliders() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async checkSliderChange() {
      this.$refs.topProgress.start();
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    onResize() {
      if (window.innerWidth >= 1250) {
        this.showBackword = true
        if (i18n.locale == "en" || localStorage.getItem("local_lang") == "en") {
          this.loadingPadding = "englishPadding";
        }
        if (i18n.locale == "ar" || localStorage.getItem("local_lang") == "ar") {
          this.loadingPadding = "arabicPadding";
        }
      }
      if (window.innerWidth < 1250) {
        this.loadingPadding = "";
        this.showBackword = false
      }
      if (window.innerWidth <= 600) {
        this.smallScrenn = "mb-14";
      } else {
        this.smallScrenn = "";
      }
    },
    manageVal: (item) => i18n.t(item.name),
    langName: (item) => i18n.t(item.name),
    botrespond(value) {
      this.botRespondValue = value;
    },
    manageValue(value) {
      this.manageListValue = value;
    },
    getSettings() {
      let getData = {
        router: "get_settings",
        number_id: this.$route.params.id,
      };
      this.post(getData, false).then((response) => {
        if (!response.data.success) {
          this.$router.push("/login");
        } else {
          this.planType = response.data.plan_type;
          if (response.data.plan_type === "1") {
            this.allowCountry.push(response.data.phone_number_country);
            this.disableAllowedCountry = true;
            this.planTypeError = "plantype_error_settings";
            let settings = response.data.settings;
            settings.map((item) => {
              this.allowedNumber = item.allowNumber || [];
              this.model = item.blockedNumber || [];
              this.blockValue = item.blockCountries || [];
              this.manageListValue = item.manageList || "";
              this.botRespondValue = item.botLang || "";
              this.operatingHours = item.operatingHours || [];
              this.timeFormatSwitch = item.timeformat || false;
              this.timezoneValue = item.timezoneValue || "";
              this.newEmailSet = item.newEmail || "";
            });
          } else {
            let settings = response.data.settings;
            settings.map((item) => {
              this.allowedNumber = item.allowNumber || [];
              this.model = item.blockedNumber || [];
              this.blockValue = item.blockCountries || [];
              this.manageListValue = item.manageList || "";
              this.botRespondValue = item.botLang || "";
              this.operatingHours = item.operatingHours || [];
              this.timeFormatSwitch = item.timeformat || false;
              this.timezoneValue = item.timezoneValue || "";
              this.newEmailSet = item.newEmail || "";
              this.allowCountry = item.allowCountry || [];
            });
          }
          this.placeholderTimeZone = "";
        }
      });
    },
    postSettings() {
      let settings = this.settingsArray;
      settings = [];
      let timeformat = this.timeFormatSwitch;
      this.$store.state.timeFormatSwitch = timeformat;
      let timeZoneValue = this.timezoneValue;
      let operatingHours = this.operatingHours;
      let blockCountries = this.blockValue;
      let allowCountries = this.allowCountry;
      let blockedNumber = this.model;
      let allowNumber = this.allowedNumber;
      let manageList = this.manageListValue;
      let botRespondArray = this.botRespondValue;
      let newEmail = this.newEmailSet;
      let settingsJson = {
        timeformat: timeformat,
        timezoneValue: timeZoneValue,
        operatingHours: operatingHours,
        blockCountries: blockCountries,
        blockedNumber: blockedNumber,
        allowNumber: allowNumber,
        manageList: manageList,
        botLang: botRespondArray,
        newEmail: newEmail,
        allowCountry: allowCountries,
      };
      settings.push(settingsJson);
      let setSettings = {
        router: "set_settings",
        number_id: this.$route.params.id,
        settings: JSON.stringify(settings),
      };
      this.post(setSettings, false).then((response) => {
        if (!response.data.success) {
          this.$router.push("/login");
        }
      });
      this.$store.state.settings = settings;
    },
    async timeFormatValue(timeformat) {
      this.$refs.topProgress.start();
      this.timeformatValue = timeformat;
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async shareValueTimezone(timezone) {
      this.$refs.topProgress.start();
      this.timezoneValue = timezone;
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    allowedBlur() {
      (this.hasErrorAllow = false), (this.errorMessageAllow = "");
      this.postSettings();
    },
    async blur() {
      (this.hasError = false), (this.errorMessage = "");
      await this.postSettings();
    },
    async deleteItem(i) {
      this.$refs.topProgress.start();
      this.showMenu = false;
      this.model.splice(i, 1);
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    async deleteAllowItem(i) {
      this.$refs.topProgress.start();
      this.showAllowedMenu = false;
      this.allowedNumber.splice(i, 1);
      await this.postSettings();
      this.$refs.topProgress.done();
    },
    showThisField(e, item, index) {
      this.profileImg = e.path[0].childNodes[0].children[0].currentSrc;
      this.isloaded = false;
      this.avatarImageLoaded = true;
      this.deleteIndex = index;
      this.thisName = item.name;
      this.thisNumber = item.number;
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    showAllowField(e, item, index) {
      this.profileImg = e.path[0].childNodes[0].children[0].currentSrc;
      this.avatarImageLoaded = true;
      this.isloaded = false;
      this.deleteAllowIndex = index;
      this.thisAllowName = item.name;
      this.thisAllowNumber = item.number;
      this.showAllowedMenu = false;
      this.xAllow = e.clientX;
      this.yAllow = e.clientY;
      this.$nextTick(() => {
        this.showAllowedMenu = true;
      });
    },
    async addAllowedNumber(val) {
      let phoneNumber = "+" + val.target.value.replace("+", "");
      let checkNumber = parseMax(phoneNumber);
      if (val.target.value != null && checkNumber != undefined) {
        try {
          let numberChecked = checkNumber.number;
          if (parseMax(numberChecked).isValid()) {
            if (await this.$refs.setConfirm.open(this.title, "contact_name")) {
              let v = {
                name: this.title,
                number: numberChecked,
              };
              this.allowedNumber.push(v);
              this.search = "";
              this.title = "";
              this.hasErrorAllow = false;
              this.errorMessageAllow = "";
            }
          } else {
            this.hasErrorAllow = true;
            this.errorMessageAllow = i18n.t("number_format_error");
            this.showNoData = false;
          }
        } catch (e) {
          this.hasErrorAllow = true;
          this.errorMessageAllow = i18n.t("number_format_error");
          this.showNoData = false;
        }
      } else {
        this.hasErrorAllow = true;
        this.errorMessageAllow = i18n.t("number_format_error");
        this.showNoData = false;
      }
    },
    async addNewNumber(val) {
      let phoneNumber = "+" + val.target.value.replace("+", "");
      let checkNumber = parseMax(phoneNumber);
      if (val.target.value != null && checkNumber != undefined) {
        try {
          let numberChecked = checkNumber.number;
          if (parseMax(numberChecked).isValid()) {
            if (await this.$refs.setConfirm.open(this.title, "contact_name")) {
              let v = {
                name: this.title,
                number: numberChecked,
              };
              this.model.push(v);
              this.search = "";
              this.hasError = false;
              this.title = "";
              this.errorMessage = "";
            }
          } else {
            this.hasError = true;
            this.errorMessage = i18n.t("number_format_error");
            this.showNoData = false;
          }
        } catch (e) {
          this.hasError = true;
          this.errorMessage = i18n.t("number_format_error");
          this.showNoData = false;
        }
      } else {
        this.hasError = true;
        this.errorMessage = i18n.t("number_format_error");
        this.showNoData = false;
      }
    },
    async getTimeZone() {
      this.post({ router: "get_time_zone" }, false).then((response) => {
        this.$store.state.timeZoneStore = response.data.time_zone;
        this.timeZone = response.data.time_zone;
        this.placeholderTimeZone = "";
        this.timeZoneLoader = false;
      });
    },
    customNumberName(item, queryText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.number.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1
      );
    },
    customFilter(item, queryText) {
      const textOne = item.text.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    customNumberFilter(item, queryText) {
      const textOne = item.phone_number.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    minutesToHHMM(mins, twentyFour = false) {
      let h = Math.floor(mins / 60);
      let m = mins % 60;
      m = m < 10 ? "0" + m : m;

      if (twentyFour) {
        h = h < 10 ? "0" + h : h;
        return `${h}:${m}`;
      } else {
        let a = i18n.t("am");
        if (h >= 12) a = i18n.t("pm");
        if (h > 12) h = h - 12;
        if (h == 0) h = 12;
        return `${h}:${m} ${a}`;
      }
    },
    changeBatteryStatusSwitch() {
      let switchBattery = this.showBatteryStatusSwitch;
      if (switchBattery) {
        localStorage.setItem(`${this.$route.params.id}_battery`, switchBattery);
      } else {
        localStorage.setItem(`${this.$route.params.id}_battery`, switchBattery);
      }
      this.showBatteryStatusSwitch = JSON.parse(
        localStorage.getItem(`${this.$route.params.id}_battery`)
      );
      bus.$emit("battery_status", switchBattery);
    },
    checkSessionState() {
      this.post({ router: "session_status" }, false).then((respone) => {
        if (
          respone.data.session == false ||
          localStorage.getItem("session_id") == null
        ) {
          this.$router.push("/login");
        }
      });
    },
  },
  beforeMount() {
    this.getSettings();
  },
  mounted() {
    window.scrollTo(0,0)
    // if (localStorage.getItem(`${this.$route.params.id}_battery`) == "true") {
    //   bus.$emit("battery_status", switchBattery);
    // }
    bus.$on("arabicLang", () => {
      if (i18n.locale == "ar") {
        this.counteryCodeLang = this.arCountry;
      }
    });
    bus.$on("englishLang", () => {
      if (i18n.locale == "en") {
        this.counteryCodeLang = this.counteryCode;
      }
    });
    this.countreyName();
    bus.$on("refreshSetting", async () => {
      this.$refs.topProgress.start();
      await this.getSettings();
      this.$refs.topProgress.done();
    });
    this.getAllContactNumber();
    this.overlay = false;
    this.showContent = true;
    this.checkSessionState();
  },
  async created() {

    await this.getTimeZone();
    bus.$on("shareTitle", (title) => {
      this.title = title;
    });
    bus.$on("closeBattery", (data) => (this.showBatteryStatusSwitch = data));
    if (this.$refs.timeZoneSelect.$refs.label !== undefined) {
      let timeZoneLabel = this.$refs.timeZoneSelect.$refs.label;
      timeZoneLabel.style.fontSize = "0.875rem";
    }
    if (
      this.$refs.block.$el.children[0].childNodes[1].childNodes[0] !== undefined
    ) {
      let message = this.$refs.block.$el.children[0].childNodes[1]
        .childNodes[0];
      message.style.color = "#b71c1c";
    }
    if (this.$refs.botRespond.$refs.label != undefined) {
      let timeZoneLabel = this.$refs.botRespond.$refs.label;
      timeZoneLabel.style.fontSize = "0.875rem";
    }

    if (this.$refs.block.$refs.label != undefined) {
      let blockCountries = this.$refs.block.$refs.label;
      blockCountries.style.fontSize = "0.875rem";
    }
    if (this.$refs.blockStates.$refs.label != undefined) {
      let blockCountries = this.$refs.blockStates.$refs.label;
      blockCountries.style.fontSize = "0.875rem";
    }

    if (this.$refs.model.$refs.label != undefined) {
      let model = this.$refs.model.$refs.label;
      model.style.fontSize = "0.875rem";
    }
    if (this.$refs.allow.$refs.label != undefined) {
      let allow = this.$refs.allow.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.chipgroup.$refs.wrapper != undefined) {
      let chipGroupContent = this.$refs.chipgroup.$refs.wrapper;
      chipGroupContent.style.overflowY = "auto";
    }
    if (this.$refs.altEmail.$refs.label != undefined) {
      let allow = this.$refs.altEmail.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.manageRef.$refs.label != undefined) {
      let allow = this.$refs.manageRef.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
  },
  updated() {
    if (
      this.$refs.block.$el.children[0].childNodes[1].childNodes[0] !== undefined
    ) {
      let message = this.$refs.block.$el.children[0].childNodes[1]
        .childNodes[0];
      message.style.color = "#b71c1c";
    }
    if (this.$refs.timeZoneSelect.$refs.label) {
      let timeZoneLabel = this.$refs.timeZoneSelect.$refs.label;
      timeZoneLabel.style.fontSize = "0.875rem";
    }
    if (this.$refs.block.$refs.label) {
      let blockCountries = this.$refs.block.$refs.label;
      blockCountries.style.fontSize = "0.875rem";
    }
    if (this.$refs.model.$refs.label) {
      let model = this.$refs.model.$refs.label;
      model.style.fontSize = "0.875rem";
    }
    if (this.$refs.allow.$refs.label) {
      let allow = this.$refs.allow.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.blockStates.$refs.label != undefined) {
      let blockCountries = this.$refs.blockStates.$refs.label;
      blockCountries.style.fontSize = "0.875rem";
    }

    if (this.$refs.altEmail.$refs.label != undefined) {
      let allow = this.$refs.altEmail.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.manageRef.$refs.label != undefined) {
      let allow = this.$refs.manageRef.$refs.label;
      allow.style.fontSize = "0.875rem";
    }
    if (this.$refs.botRespond.$refs.label != undefined) {
      let timeZoneLabel = this.$refs.botRespond.$refs.label;
      timeZoneLabel.style.fontSize = "0.875rem";
    }
  },
  mixins: [Settings],
};
</script>
<style>
* {
  letter-spacing: -0.1px !important;
}
.englishPadding {
  padding: 0 30px 0 270px !important;
}
.arabicPadding {
  padding: 0 270px 0 30px !important;
}
.theme--light.v-list-item .v-list-item__mask {
  color: black !important;
  background: none !important;
}
.smallAvatar {
  height: 16px !important;
  min-width: 16px !important;
  width: 16px !important;
  border-radius: 50% !important;
}
.bigAvatar {
  height: 36px !important;
  min-width: 36px !important;
  width: 36px !important;
  border-radius: 50% !important;
}
</style>
