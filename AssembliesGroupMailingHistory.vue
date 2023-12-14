<template>
  <div class="assemblies-group-mailing-history">
    <V2Button
      :id="`${pageId}_button_forward`" 
      view="fill" 
      style-type="primary" 
      size="md" 
      :disabled="!isData"
      @click="clear"
    >
      Очистить историю
    </V2Button>
    <div v-if="!isData" class="empty">Нет данных</div>
    <div v-else>
      <Accordion>
        <AccordionItem v-for="(ee, idx) in aaa" :key="idx">
          <template #accordion-trigger>
            <div class="title">
              {{ titles[ee.status as keyof typeof aaa] }}: <span class="count">{{ ee.amount }}</span>
              <IconSprite :color="ee.status === 'SUCCESS' ? 'white' : 'black' " :name="icons[ee.status as keyof typeof aaa]" />
            </div>
          </template>
          <template #accordion-content>
            <div>
              <AssembliesGroupMailingHistoryTable
                :table-id="ee.status" 
                :headers="headers[ee.status as keyof typeof aaa] "
                :table-data="ee.data"
                @open-modal="onOpen"
              />
            </div>
          </template>
        </AccordionItem>
      </Accordion>
      <!-- <Accordion>
        <AccordionItem v-if="dataSuccess && dataSuccess.amount">
          <template #accordion-trigger>
            <div class="title">
              Созданные: <span class="count">{{ dataSuccess.amount }}</span>
              <IconSprite color="white" name="check-single-circle" />
            </div>
          </template>
          <template #accordion-content>
            <div>
              <AssembliesGroupMailingHistoryTable
table-id="table_success" :headers="headersSuccess"
                :table-data="dataSuccess.data" />
            </div>
          </template>
        </AccordionItem>
        <AccordionItem v-if="dataWarning && dataWarning.amount">
          <template #accordion-trigger>
            <div class="title">
              Незагруженные: <span class="count">{{ dataWarning.amount }}</span>
              <IconSprite name="uil_exclamation" />
            </div>
          </template>
          <template #accordion-content>
            <div>
              <AssembliesGroupMailingHistoryTable
table-id="table_warning" :headers="headersWarning"
                :table-data="dataWarning.data" @open-modal="onOpen" />
            </div>
          </template>
        </AccordionItem>
        <AccordionItem v-if="dataError && dataError.amount">
          <template #accordion-trigger>
            <div class="title">
              Ошибочные: <span class="count">{{ dataError.amount }}</span>
              <IconSprite name="attention-circle-new" />
            </div>
          </template>
          <template #accordion-content>
            <div>
              <AssembliesGroupMailingHistoryTable
table-id="table_error" :headers="headersError"
                :table-data="dataError.data" />
            </div>
          </template>
        </AccordionItem>
      </Accordion> -->
    </div>
    <V2Modal 
      :id="`${pageId}_modal`" 
      :show="isVisible" 
      size="xl" 
      @close="onClose"
    >
      <AssemblyCreateMultipleFileForm 
        :id="`${pageId}_form`" 
        :build-data="buildData" />
    </V2Modal>
  </div>
</template>
<script setup lang="ts">

import {
  getBuildBulkImportRequest,
  downloadFileRequest
} from '@/api'


import { type IBuildExcelData } from '@/api'
import AssemblyCreateMultipleFileForm from '../../Assemblies/AssembliesCreate/AssembliesCreateMultipleFile/AssembliesCreateMultipleFileForm/AssembliesCreateMultipleFileForm.vue'
import {
  IBuildBulkImport,
  headersSuccess,
  headersWarning,
  headersError
} from './dataassembliesGroupMailingHistory'
import { usePeriodStore } from '@/stores/period'

const periodStore = usePeriodStore()
const { periodId } = storeToRefs(periodStore)

const pageId = 'assemblies_group_mailing_history'
const isVisible = ref<boolean>(false)
// const dataSuccess = ref<IBuildBulkImport>()
// const dataWarning = ref<IBuildBulkImport>()
// const dataError = ref<IBuildBulkImport>()

const aaa = ref<IBuildBulkImport[]>()
const titles = {
  SUCCESS: 'Созданные',
  WARNING: 'Незагруженные',
  ERROR: 'Ошибочные',
}
const icons = {
  SUCCESS: 'check-single-circle',
  WARNING: 'uil_exclamation',
  ERROR: 'attention-circle-new',
}
const headers = {
  SUCCESS: headersSuccess,
  WARNING: headersWarning,
  ERROR: headersError,
}


const isData = computed(() => aaa.value?.length)
// const isData = computed(() => dataSuccess.value || dataWarning.value || dataError.value)

const buildData: IBuildExcelData = {
  full_code_long: '10.11.01.01.07.03',
  full_code: '10.11.01.01.07',
  unit: 'шт.',
  name: 'Наружные сети. Электроснабжение. Установка уличного комплекта оборудования для управления.',
  references: [
    {
      id: null,
      code_value: '10',
      reference: 'object_type',
    },
    {
      id: null,
      code_value: '11',
      reference: 'system',
    },
    {
      id: null,
      code_value: '01',
      reference: 'subsystem',
    },
    {
      id: null,
      code_value: '01',
      reference: 'family',
    },
    {
      id: null,
      code_value: '07',
      reference: 'subfamily',
    },
    {
      id: null,
      code_value: null,
      reference: 'MGE_directory',
    },
  ],
  build_parameters: [
    {
      name: 'Элемент',
      unit: null,
      param_type: 'A',
      data_type: 'S',
      ifc_parameter_name: null,
      values: null,
      min_value: null,
      max_value: null,
      comment: null,
      string_value:
        'Наружные сети. Электроснабжение. Установка уличного комплекта оборудования для управления.',
      numeric_value: null,
    },
    {
      name: 'Система',
      unit: null,
      param_type: 'A',
      data_type: 'S',
      ifc_parameter_name: null,
      values: null,
      min_value: null,
      max_value: null,
      comment: null,
      string_value: 'Наружное освещение',
      numeric_value: null,
    },
    {
      name: 'Группа грунта',
      unit: null,
      param_type: 'A',
      data_type: 'S',
      ifc_parameter_name: null,
      values: ['1-5'],
      min_value: null,
      max_value: null,
      comment: null,
      string_value: null,
      numeric_value: null,
    },
  ],
  build_elements: [
    {
      order_1: 1,
      order_2: null,
      full_code: '4.8-3-4-0-240',
      element_type: null,
      work_resource_id: null,
      name: 'Монтаж пультов и шкафов управления',
      unit: '1 шт.',
      volume_formula: 'Кол-во',
      is_deleted: null,
    },
    {
      order_1: 1,
      order_2: 1,
      full_code: '71.3-20720-163',
      element_type: null,
      work_resource_id: null,
      name: 'Шкаф управления наружным освещением типа ШУНО-СС.02.РВ.1К',
      unit: 'шт.',
      volume_formula: 'Кол-во',
      is_deleted: null,
    },
    {
      order_1: 2,
      order_2: null,
      full_code: '4.8-57',
      element_type: null,
      work_resource_id: null,
      name: 'Монтаж прибора измерения и защиты',
      unit: '1 шт.',
      volume_formula: 'Кол-во',
      is_deleted: null,
    },
    {
      order_1: 2,
      order_2: 1,
      full_code: '13.1-1-724',
      element_type: null,
      work_resource_id: null,
      name: 'Ограничитель пускового тока для линий освещения со светодиодными светильниками, трехфазный, до 16 А [Время ограничения тока 20-50 мс, диапазон рабочих температур от -40 до +70 °С , степень защиты IP20, встроенный термопредохранитель, крепление на DIN-рейку, габаритные размеры 96х106х58 мм]',
      unit: 'шт.',
      volume_formula: 'Кол-во',
      is_deleted: null,
    },
  ],
  family: '',
  mge_directory: null,
  unit_directory: null,
  object_type: '',
  system: '',
  subfamily: '',
  subsystem: '',
}

const clear = () => {
  console.log('Очистить')
}

const onOpen = (id: string) => {
  console.log('from history', id)
  isVisible.value = true
}

const onClose = () => {
  isVisible.value = false
}

const onDownloadFile = async () => {
    if (!compareFileId.value) return
    downloadFileRequest(compareFileId.value).then((res) => {
      if (res?.data) downloadLocalFile(res.data, `${compareFileName.value}`)
    })
  }

const fetchBuildBulkImport = () => {
  if (!periodId.value) return
  getBuildBulkImportRequest(periodId.value).then((res) => {
    if (res?.data) {
      aaa.value = res.data
      // dataSuccess.value = res.data.filter((item: IBuildBulkImport) => item.status === 'SUCCESS')[0]
      // dataWarning.value = res.data.filter((item: IBuildBulkImport) => item.status === 'WARNING')[0]
      // dataError.value = res.data.filter((item: IBuildBulkImport) => item.status === 'ERROR')[0]
    }
  })
}

watch(
  () => periodId.value,
  () => fetchBuildBulkImport()
)

onMounted(() => {
  fetchBuildBulkImport()
})
</script>

<style scoped lang="sass">
  @import "assembliesGroupMailingHistory"
</style>
