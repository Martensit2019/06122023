<template>
  <V2TableRow class="table_base__tr-body">
    <template v-for="(head, ind) in headers" :key="ind + 'body'">
      <V2TableCol
        v-if="arrayCode.includes(head.code)"
        :id="`${tableId}_${index}_${ind}`"
        class="table_base__td-body table_base__td-body-th"
        :class="{ collisions: modelValueData.error_message && (modelValueData.error_message !== 'Дубликат номера' && modelValueData.error_message !== 'LLL') }"
      >
        <div class="cell">
          <div class="actions" :class="{ blue: areIconsBlue }">
            <IconSprite
              :view-box="getViewBox"
              name="trash-01"
              @click="onDeleteClick(modelValueData)"
            />
          </div>
        </div>
      </V2TableCol>

      <V2TableCol
        v-else-if="head.code === 'full_code'"
        class="table_base__td-body"
        :class="{ highlighted: props.data.highlighted }"
      >
        <Popover
          id="popover"
          text="Код не найден в данных Норматив"
          :arrow="false"
          :right="true"
          :width="200"
          :disabled="!props.data.highlighted"
        >
          <div class="cell">
            <span>{{ modelValueData[head.code] }}</span>
          </div>
        </Popover>
      </V2TableCol>

      <V2TableCol
        v-else-if="head.code === 'code' && expand"
        class="table_base__td-body"
        :class="[
          { collisions: modelValueData.error_message },
          { highlighted: props.data.highlighted },
        ]"
      >
        <div
          v-if="modelValueData.row_elements?.length"
          class="actions actions-shifted"
        >
          <div
            :style="{
              width: '20px',
              height: '20px',
              marginLeft: '-12px',
              marginRight: '8px',
              cursor: 'pointer',
            }"
            class="d-flex items-center justify-center table_base_share_icon"
            @click="onClickRowOpen"
          >
            <IconSprite
              v-if="!isOpenRow"
              :width="20"
              :height="20"
              name="plus"
              class="table_base__plus"
            />
            <IconSprite
              v-else
              :width="14"
              :height="3"
              name="minus"
              view-box="0 0 14 3"
              class="table_base__plus"
            />
          </div>
          <span>{{ modelValueData[head.code] }}</span>
        </div>
        <div v-else class="cell">
          <span>{{ modelValueData[head.code] }}</span>
        </div>
      </V2TableCol>

      <V2TableCol
        v-else-if="head.type === 'input'"
        :id="`${tableId}_${index}_${ind}`"
        class="table_base__td-body"
        :class="{ highlighted: modelValueData.error_message && data.error }"
      >
        <Popover
          id="popover"
          :text="modelValueData.error_message"
          :arrow="false"
          :left="true"
          :width="200"
          :disabled="!modelValueData.error"
        >
        <div class="cell">
          <Input
            v-if="!modelValueData.row_elements?.length || head.type === 'input'"
            :id="`${tableId}_${index}_${ind}_input`"
            v-model="modelValueData[head.code]"
            is-number-input
            :is-autofocus="!!modelValueData[head.code]"
            type="text"
            size="small"
            @change="emit('change-row')"
            @update:model-value="emit('update-row', props.data)"
          />
          <template v-else> - </template>
        </div>
        </Popover>
      </V2TableCol>

      <V2TableCol
        v-else-if="head.code === 'row_number'"
        :id="`${tableId}_${index}_${ind}`"
        class="table_base__td-body"
        :class="{ collisions: modelValueData.error_message }"
      >
        <div class="cell">
          <span>{{ index + 1 }}</span>
        </div>
      </V2TableCol>

      <V2TableCol
        v-else
        :id="`${tableId}_${index}_${ind}`"
        class="table_base__td-body"
        :class="{ collisions: modelValueData.error_message && (modelValueData.error_message !== 'Дубликат номера' && modelValueData.error_message !== 'LLL') }"
      >
        <div class="cell">
          <span>{{ modelValueData[head.code] }}</span>
        </div>
      </V2TableCol>
    </template>
  </V2TableRow>

  <template v-if="isOpenRow">
    <V2TableRow
      v-for="(item, idxChild) in modelValueData.row_elements"
      :key="item.code"
      class="table_base__tr-body"
    >
      <V2TableCol> </V2TableCol>
      <V2TableCol>
        <div class="cell">
          <span>{{ item.full_code }}</span>
        </div>
      </V2TableCol>
      <V2TableCol>
        <div class="cell">{{ item.name }}</div>
      </V2TableCol>
      <V2TableCol>
        <div class="cell">{{ item.unit }}</div>
      </V2TableCol>
      <V2TableCol>
        <div class="cell">
          <Input
            :id="`${tableId}_${index}_${idxChild}_input`"
            v-model="item.count"
            is-number-input
            type="text"
            size="small"
          />
        </div>
      </V2TableCol>
      <V2TableCol>
        <div class="cell">
          <div class="actions" :class="{ blue: areIconsBlue }">
            <IconSprite
              :view-box="getViewBox"
              name="trash-01"
              @click="onDeleteChild(item, modelValueData.code)"
            />
          </div>
        </div>
      </V2TableCol>
    </V2TableRow>
  </template>
</template>

<script setup lang="ts">
  import type { ITableData } from '@/components/library/LibraryRegistry/interfaceLibraryRegistry'
  import type { IHeaders } from '@/components/library/libraryComponents/interfaceLibraryComponents'
  import type { IObject } from '@/components/common/interfaceCommon'

  interface IProps {
    tableId: string
    data: ITableData
    index: number
    expand?: boolean
    areIconsBlue?: boolean
    headers: IHeaders[]
    areIconsSmall?: boolean
  }

  interface IEmits {
    (e: 'update:data', val: ITableData): void
    (e: 'deleteRow', row: IObject): void
    (e: 'change-row'): void
    (e: 'update-row', row: IObject): void
    (e: 'deleteChildRow', row: IObject, parentCode: string): void
  }

  const props = defineProps<IProps>()

  const emit = defineEmits<IEmits>()

  const modelValueData = computed({
    get: () => props.data,
    set: (val) => emit('update:data', val),
  })

  const getViewBox = computed(() =>
    props.areIconsSmall ? '-5 -5 32 32' : '0 0 24 24',
  )

  const arrayCode: string[] = ['actions']

  const isOpenRow = ref(false)

  const onDeleteClick = (row: IObject) => {
    emit('deleteRow', row)
  }

  const onDeleteChild = (row: IObject, parentCode: string) => {
    emit('deleteChildRow', row, parentCode)
  }

  function onClickRowOpen() {
    isOpenRow.value = !isOpenRow.value
  }
</script>

<style lang="sass" scoped>
  @import './assembliesObjectTableRow'
</style>
