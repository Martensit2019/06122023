<template>
  <div class="assembly-group">
    <div :key="setStateWindow" class="layout">
      <GridLayout
        v-model:layout="windowSettings"
        :col-num="12"
        :row-height="10"
        :is-draggable="true"
        :is-resizable="true"
        :responsive="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in windowSettings"
          :key="item.i"
          class="grid-item__wrapper"
          :is-draggable="item.draggable"
          :is-resizable="item.resizable"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="3"
          :min-h="3"
          :i="item.i"
          drag-allow-from=".assemblies-window__head"
          drag-ignore-from=".no-drag"
          @resize="resizeEvent"
        >
          <div v-if="item.i === '0'">
            <AssembliesWindow
              id="assembly_group_forming_window"
              title="Формирование ПСМ"
              :is-title-small="true"
              extra-style=""
              is-minus-centered
              :i="0"
              @state-window="stateWindow"
            >
              <AssembliesForming
                :build-element-groups-data="buildElementsList"
                :is-save-btn-disabled="isSaveDisabled || !isLoadedBuildData"
                :is-cant-delete="
                  isDeleteState ||
                  isApprovedState ||
                  isPublishedState ||
                  !isLoadedBuildData
                "
                :is-cant-open-scenarios="
                  isDeleteState ||
                  isApprovedState ||
                  isPublishedState ||
                  !isLoadedBuildData
                "
                :resize-height-forming-psm-table="resizeHeightFormingPsmTable"
                :is-edit-state="!isDeleteState"
                :is-editing="isEditing"
                :is-loading="isLoadingForming"
                :highlighted-ids="highlightedIds"
                are-icons-small
                are-icons-blue
                @submit-changes="onSubmit"
                @delete-element="onDeleteElement"
                @drag-elements="onAddElements"
                @change-row="onChangeRow"
                @update-row="updateRow"
                @renumber="renumber"
              />
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '1'" class="assemblies-group__grid-item">
            <AssembliesWindow
              id="assembly_group_image"
              title="Изображение ЦИМ элемента ПСМ"
              class="assemblies-group__image__outer-container"
              max-width="100%"
              is-minus-centered
              :i="1"
              @state-window="stateWindow"
            >
              <div class="assemblies-group__image__inner-container">
                <AssembliesImage
                  :build-id="buildId"
                  id-prev="assembly_group_btn_prev"
                  id-next="assembly_group_btn_next"
                  has-download
                />
              </div>
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '2'" class="assembly-group__window">
            <AssembliesWindow
              id="assembly_group_estimate_structure_base_window"
              title="Структура расценок и ресурсов ТИМ Норматив"
              :is-title-small="true"
              extra-style=""
              is-minus-centered
              :i="2"
              @state-window="stateWindow"
            >
              <Tab
                v-model="assembliesTab"
                is-keep-mount
                class="assembly-group__tab"
              >
                <TabItem :id="`1`" value="rates" label="Расценки">
                  <Input
                    id="assembly_group_input_structure"
                    v-model="searchText"
                    class="assembly-group__input-structure"
                    placeholder="Введите поисковый запрос..."
                    :type="typeInput"
                    size="xs"
                    @search="onSearchInput"
                    @enter="onSearchInput"
                    @clear="onSearchReset"
                  />
                  <AssemblyNormativTree
                    :key="keyWorksTree"
                    :tree="normativWorksRoot"
                    :selected-item="workSelectedTree"
                    :search-error="searchError"
                    :is-instance-data-loading="isInstanceDataLoading"
                    type="works"
                    @select-child-node="onWorkSelect"
                    @set-status-item="setStatusItem"
                  />
                </TabItem>

                <TabItem id="2" value="resources" label="Ресурсы">
                  <Input
                    id="assembly_group_input_structure"
                    v-model="searchText"
                    class="assembly-group__input-structure"
                    placeholder="Введите поисковый запрос..."
                    :type="typeInput"
                    size="xs"
                    @search="onSearchInput"
                    @enter="onSearchInput"
                    @clear="onSearchReset"
                  />
                  <AssemblyNormativTree
                    :key="keyResourceTree"
                    :tree="normativFilesRoot"
                    :selected-item="resourceSelectedTree"
                    :search-error="searchError"
                    :is-instance-data-loading="isInstanceDataLoading"
                    type="resource"
                    @select-child-node="onResourceSelect"
                    @set-status-item="setStatusItem"
                  />
                </TabItem>
              </Tab>
              <Button
                v-if="isShowCollapseBtn"
                id="assembly_group_btn_collapse"
                class="assembly-group__btn-collapse"
                text="Свернуть"
                size="small"
                color="primary"
                view="default"
                @click="collapseStructure"
              />
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '3'" class="assembly-group__window">
            <AssembliesWindow
              id="assembly_group_unit_rates_resources_ais_standard"
              extra-style=""
              title="Единичные расценки и ресурсы ТИМ норматив"
              :is-title-small="true"
              is-minus-centered
              :i="3"
              @state-window="stateWindow"
            >
              <AssemblyGroupNormative
                :assemblies-tab="assembliesTab"
                :work-selected-tree="workSelectedTree"
                :current-normativ-work="currentNormativWork"
                :resource-selected-tree="resourceSelectedTree"
                :current-resource="currentResource"
                :build-elements-count="buildElementsCount"
                :resize-height-normative-table="resizeHeightNormativeTable"
                :is-delete-state="isDeleteState"
                :is-approved-state="isApprovedState"
                :is-published-state="isPublishedState"
                @add-element-groupe="onAddElementGroupe"
                @add-elements-ais="onAddElementsAIS"
              />
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '4'">
            <AssembliesWindow
              id="assembly_group_common_params_window"
              extra-style=""
              title="Параметры и атрибуты"
              :is-title-small="true"
              is-minus-centered
              :i="4"
              @state-window="stateWindow"
            >
              <div
                class="assemblies-group__params"
                :style="{
                  maxHeight: resizeHeightCommonParamsAttributesTable
                    ? resizeHeightCommonParamsAttributesTable - 70 + 'px'
                    : 220 + 'px',
                }"
              >
                <AssembliesCommonParams
                  id="assembly_group_params_table_param"
                  :data="buildParamsTypeS"
                  is-only-table
                  is-full-width
                  type="attribute"
                />
                <AssembliesCommonParams
                  id="assembly_group_params_table_attribute"
                  :data="buildParamsTypeN"
                  is-only-table
                  is-full-width
                  type="param"
                  class="mt-20"
                />
              </div>
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '5'">
            <AssembliesWindow
              id="assembly_group_params_window"
              extra-style=""
              title="Параметры и атрибуты МГЭ"
              :is-title-small="true"
              is-minus-centered
              :i="5"
              @state-window="stateWindow"
            >
              <div
                class="assemblies-group__params"
                :style="{
                  maxHeight: resizeHeightParamsAttributesTable
                    ? resizeHeightParamsAttributesTable - 70 + 'px'
                    : 220 + 'px',
                }"
              >
                <PsmTablePrmsAtrrbs
                  id="assembly_group_params_table_mge"
                  :build-mge-data="mgeParamsReference"
                  is-can-hidden-by-group
                  is-tooltip-note
                  size="small"
                  class="assembly-import-mge__table"
                />
              </div>
            </AssembliesWindow>
          </div>
          <div v-if="item.i === '6'">
            <ExportToExcelCard :build-data="buildData" :build-id="buildId" />
          </div>
        </grid-item>
      </GridLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {
    getReferencesByNameRequest,
    getListAssemblyElements,
    postBuildAddElementRequest,
    updateBuildElement,
    deleteBuildElement,
    getBuildsDataElement,
    getReferenceRequest,
    IBuild,
    getBuildParameters,
    getBuildsRecalcNormativData,
  } from '@/api'
  import {
    ITreeItemNormativ,
    getFileResourcesRequest,
    getFileWorksRequest,
    ITreeItemNormativLeaf,
    ITreeItemNormativLeafResponse,
    getNormativeSearch,
    INormativTreeSearch,
  } from '@/api/normativData'
  import { GridLayout, GridItem } from 'vue3-grid-layout-next'
  import {
    IBuildElements,
    IBuildElementGroups,
    IAssembliesGroup,
    IAssembliesElement,
  } from '@/components/assemblies/AssembliesView/AssemblyGroup/interfaceAssembliesGroup'
  import { IMgeParams } from '@/components/assemblies/AssembliesView/interfaceAssemblies'
  import { IBuildParams } from '@/components/assemblies/AssembliesCommonParams/interfaceParams'

  import { IObject } from '@/components/common/interfaceCommon'
  import { restoreTableNumberingOrder } from '@/helpers'
  import settings from '@/screens/Assemblies/AssembliesView/AssembliesViewWindowSettings'
  import { IMgeParameterReference } from '@/api'
  import { BUILD_STATUS_CODE, REFERENCE } from '@/enums'
  import { useAppStore } from '@/stores/app'
  import { usePeriodStore } from '@/stores/period'
  import { reloadBuildBusKey } from '@/components/assemblies/AssembliesView/busKey'

  const bus = useEventBus(reloadBuildBusKey)
  const { params: routeParams } = useRoute()
  const appStore = useAppStore()
  const periodStore = usePeriodStore()
  const { periodId, normativPeriodId } = storeToRefs(periodStore)
  const buildId = Number(routeParams.id)
  const mgeParamsReference = ref<IMgeParameterReference[]>([])
  const buildData = ref<IBuild | null>(null)
  const assembliesTab = ref('rates')
  const isEditing = ref<boolean>(true)
  const isLoadingForming = ref<boolean>(true)
  const highlightedIds = ref<number[]>([])

  const isLoadedBuildData = computed(() => !!buildData.value)
  const isDeleteState = computed(
    () => unref(buildData)?.state?.code === BUILD_STATUS_CODE.toBeRemoved,
  )
  const isApprovedState = computed(
    () => unref(buildData)?.state?.code === BUILD_STATUS_CODE.approved,
  )
  const isPublishedState = computed(
    () => unref(buildData)?.state.code === BUILD_STATUS_CODE.published,
  )

  const normativFilesRoot = ref<ITreeItemNormativ[]>([])
  const normativFilesRootInitial = ref<ITreeItemNormativ[]>([])
  const normativWorksRoot = ref<ITreeItemNormativ[]>([])
  const normativWorksRootInitial = ref<ITreeItemNormativ[]>([])
  const currentNormativWork = ref<ITreeItemNormativLeafResponse | null>(null)
  const currentResource = ref<ITreeItemNormativLeafResponse | null>(null)
  const workSelectedTree = ref<ITreeItemNormativ | null>(null)
  const resourceSelectedTree = ref<ITreeItemNormativ | null>(null)
  const buildParams = ref<IBuildParams[]>([])

  function loadNormativFileWork() {
    if (!normativPeriodId.value) return
    getFileWorksRequest(normativPeriodId.value).then(({ data }) => {
      if ('main_filename' in data) {
        // должено приходить название корневого файла, но там почему-то неправильное имя
        getFileWorksRequest(normativPeriodId.value as number, 'root.json').then(
          // ESLINT-DISABLE: Старая реализация
          // eslint-disable-next-line @typescript-eslint/no-shadow
          ({ data }) => {
            if ('results' in data) {
              normativWorksRoot.value =
                data.results as unknown as ITreeItemNormativ[]
              normativWorksRootInitial.value =
                data.results as unknown as ITreeItemNormativ[]
            }
          },
        )
      }
    })
  }

  function loadNormativFileResource() {
    if (!normativPeriodId.value) return
    getFileResourcesRequest(normativPeriodId.value).then(({ data }) => {
      if ('main_filename' in data) {
        getFileResourcesRequest(
          normativPeriodId.value as number,
          'root.json',
          // ESLINT-DISABLE: Старая реализация
          // eslint-disable-next-line @typescript-eslint/no-shadow
        ).then(({ data }) => {
          if ('results' in data) {
            normativFilesRoot.value =
              data.results as unknown as ITreeItemNormativ[]
            normativFilesRootInitial.value =
              data.results as unknown as ITreeItemNormativ[]
          }
        })
      }
    })
  }

  function onWorkSelect(data: ITreeItemNormativ) {
    workSelectedTree.value = data

    if (!data.works_leaf_file) {
      currentNormativWork.value = null

      appStore.addAppAlert({
        color: 'wrong',
        text: 'У выбранного элемента отсутствует "works_leaf_file"',
      })
      return
    }

    if (!normativPeriodId.value) return
    getFileWorksRequest(normativPeriodId.value, data.works_leaf_file).then(
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line @typescript-eslint/no-shadow
      ({ data }) => {
        currentNormativWork.value =
          data as unknown as ITreeItemNormativLeafResponse
      },
    )
  }

  function onResourceSelect(data: ITreeItemNormativ) {
    resourceSelectedTree.value = data
    if (!data.resources_leaf_file) {
      currentResource.value = null
      appStore.addAppAlert({
        color: 'wrong',
        text: 'У выбранного элемента отсутствует "resources_leaf_file"',
      })
      return
    }

    if (!normativPeriodId.value) return
    getFileResourcesRequest(
      normativPeriodId.value,
      data.resources_leaf_file,
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line @typescript-eslint/no-shadow
    ).then(({ data }) => {
      currentResource.value = data as unknown as ITreeItemNormativLeafResponse
    })
  }

  const getBuildData = () => {
    if (!periodId.value) return
    getBuildsDataElement(buildId, periodId.value).then((res) => {
      if (res?.data) {
        buildData.value = res.data
        const MGECode = res.data?.MGE_directory?.code
        getReferenceRequest(REFERENCE.build_mge_parameters, {
          limit: 1000,
          // ESLINT-DISABLE: Старая реализация
          // eslint-disable-next-line @typescript-eslint/no-shadow
        }).then((res) => {
          if (res?.data?.results) {
            mgeParamsReference.value = res.data.results.filter(
              (el: IMgeParams) => el.directory === MGECode,
            )
          }
        })
        fetchNormativDataById()
      }
    })
  }

  const getBuildParams = async () => {
    if (periodId.value) {
      try {
        await getBuildParameters(buildId, periodId.value).then((res) => {
          if (res?.data) {
            buildParams.value = res.data.build_parameters
          }
        })
      } catch (error) {
        appStore.removeAppAlert(appStore.appAlerts.length - 1)
      }
    }
  }

  const buildParamsTypeS = computed(() =>
    buildParams.value
      .filter((el) => el.data_type === 'S')
      .map((el) => ({ ...el, values: (el.values as string[])?.join(', ') })),
  )

  const buildParamsTypeN = computed(() =>
    buildParams.value.filter((el) => el.data_type === 'N'),
  )

  const windowSettings = ref([...settings.group])
  windowSettings.value = windowSettings.value.map((item, idx) => ({
    ...item,
    i: idx.toString(),
  }))

  const defaultHeights = windowSettings.value.map((item) => item.h)
  const minRowHeight = 3
  const setStateWindow = ref<number>(0)
  const stateWindow = (setting: [boolean, number]) => {
    windowSettings.value[setting[1]].h = setting[0]
      ? defaultHeights[setting[1]]
      : minRowHeight
    if (setting[0] && setting[1] === 0) resizeHeightFormingPsmTable.value = null
    if (setting[0] && setting[1] === 3) resizeHeightNormativeTable.value = null
    if (setting[0] && setting[1] === 4) {
      resizeHeightCommonParamsAttributesTable.value = null
    }
    if (setting[0] && setting[1] === 5) {
      resizeHeightParamsAttributesTable.value = null
    }
    windowSettings.value[setting[1]].resizable = !!setting[0]
    setStateWindow.value++
  }

  const { params } = useRoute()
  const buildElements = ref<IBuildElements[]>([])
  const buildElementGroups = ref<IBuildElementGroups[]>([])
  const resourceGroups = ref<IAssembliesGroup[]>([])
  const workGroups = ref<IAssembliesGroup[]>([])
  const resources = ref<IAssembliesElement[]>([])
  const works = ref<IAssembliesElement[]>([])

  const resizeHeightCommonParamsAttributesTable = ref<number | null>(null)
  const resizeHeightParamsAttributesTable = ref<number | null>(null)
  const resizeHeightFormingPsmTable = ref<number | null>(null)
  const resizeHeightNormativeTable = ref<number | null>(null)
  const addedGroupsList = ref<IObject[]>([])
  const removedElementsList = ref<IBuildElements[]>([])
  const elementsGroupName = ref<string>('')
  const isSaveDisabled = ref<boolean>(true)
  const selectedNodeCode = ref<string | undefined>(undefined)

  const selectedGroup = computed(() => {
    if (!selectedNodeCode.value) return undefined

    if (findGroupByCode(resourceGroups.value, selectedNodeCode.value)) {
      elementsGroupName.value = 'resource_group'
      return filterGroupByCode(resourceGroups.value, selectedNodeCode.value)
    }
    if (findGroupByCode(workGroups.value, selectedNodeCode.value)) {
      elementsGroupName.value = 'work_group'
      return filterGroupByCode(workGroups.value, selectedNodeCode.value)
    }

    return undefined
  })

  const findGroupByCode = (array: IObject[], groupCode: string) =>
    array.find((group: IObject) => group.full_code === groupCode)

  const filterGroupByCode = (array: IObject[], code: string) =>
    array.filter((item) => item.full_code === code)

  const onDeleteElement = (removedElement: IObject) => {
    isSaveDisabled.value = false
    buildElementsList.value.forEach((element) => {
      if (element.id === removedElement.id) {
        removedElementsList.value.push(element)
      }
    })

    buildElements.value = [...buildElements.value].filter((element) => {
      if (removedElement.id) {
        return element.id !== removedElement.id
      }

      return true
    })
    addedElementsList.value = [...addedElementsList.value].filter((element) => {
      if (removedElement.id) {
        return element.id !== removedElement.id
      }

      return true
    })
  }

  const addedElements = ref<IBuildElementGroups[] | undefined>(undefined)
  const addedElementsList = ref<IBuildElements[]>([])

  const onAddElements = () => {
    if (!selectedGroup.value?.length) return
    isSaveDisabled.value = false

    selectedGroup.value.forEach((group) => {
      // ESLINT-ERROR: Старая реализация
      // eslint-disable-next-line no-param-reassign
      group.element_type = elementsGroupName.value
      addedGroupsList.value.push(group)
    })

    const filteredGroups = selectedGroup.value.filter((selectedElement) =>
      buildElementGroups.value?.every(
        (element) => element.full_code !== selectedElement.full_code,
      ),
    )

    addedElements.value = filteredGroups.map((element: IObject) => ({
      name: element.name,
      unit: element.unit,
      actions: true,
      full_code: element.full_code,
      group_full_code: element.group_full_code,
    }))

    buildElementGroups.value = [
      ...addedElements.value,
      ...buildElementGroups.value,
    ]
  }

  const onAddElementGroupe = (addedGroup: IBuildElements) => {
    addedElementsList.value.push(addedGroup)
  }

  const onAddElementsAIS = (
    element_type: string,
    selectedList: ITreeItemNormativLeaf[],
  ) => {
    selectedList.forEach((selectedItem: ITreeItemNormativLeaf) => {
      const selectedElement = {
        actions: true,
        comment: '',
        created_at: '',
        element_type,
        full_code: selectedItem.code,
        group_id: null,
        id: buildElementsList.value.length + 1000000,
        name: selectedItem.title,
        order: buildElements.value.length + 1,
        order_1: null,
        order_2: null,
        unit: selectedItem.uom_title,
        updated_at: '',
        volume_formula: '',
        work_resource_id: selectedItem.work_id,
      }
      addedElementsList.value.push(selectedElement)
    })
  }

  const onSubmit = () => {
    if (!periodId.value || !normativPeriodId.value) return
    if (changedRowsSet.value.length) {
      buildElements.value.forEach((build: IObject) => {
        const payload = {
          build_id: buildId,
          build_element_id: build.id,
          element_type: build.element_type,
          full_code: build.full_code,
          name: build.name,
          order_1: build.order_1,
          order_2: build.order_2,
          unit: build.unit,
          volume_formula: build.volume_formula,
        }
        if (periodId.value) updateBuildElement(periodId.value, payload)
      })
    }

    addedElementsList.value.forEach((element) => {
      postBuildAddElementRequest(
        {
          build_id: Number(params.id),
          full_code: element.full_code,
          element_type: element.element_type,
          name: element.name,
          unit: element.unit,
          work_resource_id: element?.work_resource_id || null,
          normative_period_id: Number(normativPeriodId.value),
        },
        periodId.value as number,
      ).finally(() => fetchBuildElements())
    })

    if (removedElementsList.value?.length) {
      removedElementsList.value.forEach((element: IBuildElements) => {
        if (element.id) {
          deleteBuildElement(element.id, periodId.value as number).finally(() =>
            fetchBuildElements(),
          )
        }
      })
    }
    addedElementsList.value = []
    addedGroupsList.value = []
    removedElementsList.value = []
    addedElements.value = undefined
    isSaveDisabled.value = true
  }
  watch(
    () => addedElementsList.value.length,
    () => {
      isSaveDisabled.value = false
    },
  )
  watch(
    () => assembliesTab.value,
    () => {
      workSelectedTree.value = null
      currentNormativWork.value = null
      resourceSelectedTree.value = null
      currentResource.value = null
      searchError.value = ''
      searchText.value = ''
    },
  )  

  const fetchNormativDataById = () => {
    if(!periodId.value) return
    if(buildData?.value?.state.code === 'actualisation' || 
     buildData?.value?.state.code === 'need regrouping'){
      getBuildsRecalcNormativData(periodId.value, buildId).then((res) => {
        highlightedIds.value = [].concat(...[...res.data.name_changed, ...res.data.not_found, ...res.data.uom_changed].map((it: IObject) => it.ids)).map((i: IObject) => i.build_element_ids)
      }).finally(() => {
        fetchBuildElements()
      })
     }else{
      fetchBuildElements()
     }
  } 
  
  const fetchBuildElements = async () => {
    if (!periodId.value) return
    try {
      await getListAssemblyElements(buildId, periodId.value).then((res) => {
        if (res?.data) {
          buildElements.value = res.data.build_elements
        }
      })
    } catch (error) {
      appStore.removeAppAlert(appStore.appAlerts.length - 1)
    } finally{
      isLoadingForming.value = false
    }
  }

  const fetchResourceGroups = () => {
    getReferencesByNameRequest('sss_resource_groups').then((res) => {
      if (res?.data) resourceGroups.value = res.data.results
    })
  }

  const fetchWorkGroups = () => {
    getReferencesByNameRequest('sss_work_groups').then((res) => {
      if (res?.data) workGroups.value = res.data.results
    })
  }

  const fetchResources = () => {
    getReferencesByNameRequest('sss_resources').then((res) => {
      if (res?.data) resources.value = res.data.results
    })
  }

  const fetchWorks = () => {
    getReferencesByNameRequest('sss_works').then((res) => {
      if (res?.data) works.value = res.data.results
    })
  }

  const isGroupsLoaded = ref<boolean>(false)

  const buildElementsList = computed(() => [
    ...buildElements.value,
    ...addedElementsList.value,
  ])
  const buildElementsCount = computed(() => buildElementsList.value.length)

  loadNormativFileResource()
  loadNormativFileWork()

  // start: Работа с логикой сворачивания структуры расценок и ресурсов ТИМ Норматив
  const openedWorksItems = ref<number[]>([])
  const openedResourceItems = ref<number[]>([])
  const keyWorksTree = ref<number>(0)
  const keyResourceTree = ref<number>(0)
  const isRates = computed(() => assembliesTab.value === 'rates')
  const isShowCollapseBtn = computed(
    () =>
      (isRates.value && openedWorksItems.value.length) ||
      (!isRates.value && openedResourceItems.value.length),
  )

  const setStatusItem = (data: IObject) => {
    if (data.isOpen) {
      // ESLINT-ERROR: Старая реализация
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isRates.value
        ? openedWorksItems.value.push(data.classifier_id)
        : openedResourceItems.value.push(data.classifier_id)
    } else {
      const idx = isRates.value
        ? openedWorksItems.value.indexOf(data.classifier_id)
        : openedResourceItems.value.indexOf(data.classifier_id)
      if (isRates.value) {
        if (idx > -1) openedWorksItems.value.splice(idx, 1)
      } else {
        if (idx > -1) openedResourceItems.value.splice(idx, 1)
      }
    }
  }

  const collapseStructure = () => {
    if (assembliesTab.value === 'rates') {
      openedWorksItems.value = []
      keyWorksTree.value++
      workSelectedTree.value = null
      currentNormativWork.value = null
    } else {
      openedResourceItems.value = []
      keyResourceTree.value++
      resourceSelectedTree.value = null
      currentResource.value = null
    }
  }
  // end: Работа с логикой сворачивания структуры расценок и ресурсов ТИМ Норматив

  // start: Работа с логикой поиска структуры расценок и ресурсов ТИМ Норматив
  const searchError = ref<string>('')
  const searchText = ref<string>('')
  const isInstanceDataLoading = ref<boolean>(false)
  const typeInput = computed(() =>
    searchText.value ? 'custom-search-reset' : 'custom-search',
  )

  const onSearchInput = () => {
    if (!normativPeriodId.value) return
    searchError.value = ''
    const area = isRates.value ? 'works_tree' : 'resources_tree'
    if (searchText.value.length) {
      const payload: INormativTreeSearch = {
        normativ_period_id: normativPeriodId.value,
        search_text: searchText.value,
        area,
        fields: 'all',
      }
      isInstanceDataLoading.value = true
      getNormativeSearch(payload)
        .then((res) => {
          if (res.data) {
            if (isRates.value) {
              normativWorksRoot.value = res.data.results
            } else {
              normativFilesRoot.value = res.data.results
            }
            if (!res.data.results.length) searchError.value = 'Совпадений нет'

            if (res.data.too_many_results) {
              searchError.value = `Получено слишком много результатов, отображены первые ${res.data.total_items}`
            }
          }
        })
        .catch((err) => {
          searchError.value = err.response.data.error.error_message
        })
        .finally(() => {
          isInstanceDataLoading.value = false
        })
    } else {
      onSearchReset()
    }
    keyWorksTree.value++
  }

  const onSearchReset = () => {
    searchError.value = ''
    searchText.value = ''
    if (isRates.value) {
      normativWorksRoot.value = normativWorksRootInitial.value
    } else {
      normativFilesRoot.value = normativFilesRootInitial.value
    }
  }

  // end: Работа с логикой поиска структуры расценок и ресурсов ТИМ Норматив

  onMounted(async () => {
    getBuildData()    
    getBuildParams()
    Promise.all([fetchResourceGroups(), fetchWorkGroups()]).then(() => {
      isGroupsLoaded.value = true
    })
    Promise.all([fetchResources(), fetchWorks()]).then()
    bus.on((e) => {
      if (e === 'reload') {
        getBuildData()
      }
    })
  })

  const duplicateOrders = computed(() =>
    buildElements.value
      .map((build: IObject) => build.order)
      .filter((number, index, numbers) => numbers.indexOf(number) !== index),
  )

  const isValidOrder = (order: string) => {
    const regex = /^\d+(\.\d+)?$/
      if(regex.test(order)){
        const orderArr = order.split('.')
        if(orderArr.length === 1 && orderArr[0] === '0') return false
        if(orderArr.length === 2){
          if(orderArr[0] === '0' || orderArr[1] === '0') return false
        }
        return true           
      }
      return false
  }

  const changedRows = ref<number[]>([])
  const changedRowsSet = computed(() => [...new Set(changedRows.value)])

  // eslint-disable-next-line consistent-return
  const updateRow = (row: IObject) => {
    changedRows.value.push(row.id)

    buildElements.value.forEach((build: IObject) => {
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line no-param-reassign
      build.error = false
    })
    if (duplicateOrders.value.length) {
      for (let i = 0; i < duplicateOrders.value.length; i++) {
        buildElements.value.forEach((build: IObject) => {
          if (build.order === duplicateOrders.value[i]) {
            // ESLINT-DISABLE: Старая реализация
            // eslint-disable-next-line no-param-reassign
            build.error = true
            // eslint-disable-next-line no-param-reassign
            build.error_message = 'Дубликат номера'
          }
        })
      }
    }
    // -----------
    // if(){
      const regex = /^\d+(\.\d+)?$/
      if(regex.test(row.order)){
        const orderArr = row.order.split('.')
        if(orderArr.length === 1 && orderArr[0] === '0') return false
        if(orderArr.length === 2){
          if(orderArr[0] === '0' || orderArr[1] === '0') return false
        }              
      }

      
      

      console.log(regex.test(row.order));
      
      
      console.log('row', row.order);

      const sss = isValidOrder(row.order)
      console.log('AAA', sss);

      if(isValidOrder(row.order)){
        console.log(row.id)
        const curIdx = buildElements.value.findIndex((build: IObject) => build.id === row.id)
        console.log('curIdx', curIdx);
        
        // buildElements.value[curIdx].error = true
        buildElements.value.forEach((build: IObject) => {
          if(build.id === row.id){
             // eslint-disable-next-line no-param-reassign
             build.error = true
            // eslint-disable-next-line no-param-reassign
            build.error_message = 'LLL'
          }
        })
      }
      
    // }
    // -------------
    buildElements.value.forEach((build: IObject) => {
      const orderSpit = build.order.split('.')
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line no-param-reassign
      build.order_1 = orderSpit[0]
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line no-param-reassign
      build.order_2 = orderSpit[1] ? orderSpit[1] : null
    })

   
  }

  const onChangeRow = () => {
    isEditing.value = false
  }

  const renumber = () => {
    buildElements.value.forEach((build: IObject) => {
      // ESLINT-DISABLE: Старая реализация
      // eslint-disable-next-line no-param-reassign
      build.error = false
    })
    buildElements.value = restoreTableNumberingOrder(buildElements.value)
    isEditing.value = false
  }

  // отслеживаем высоту и ширину окна при ресайзе
  const resizeEvent = (
    i: string | number,
    newH: number,
    newW: number,
    newHPx?: number,
  ) => {
    if (i === '0' && newHPx) resizeHeightFormingPsmTable.value = newHPx
    if (i === '3' && newHPx) resizeHeightNormativeTable.value = newHPx
    if (i === '4' && newHPx) {
      resizeHeightCommonParamsAttributesTable.value = newHPx
    }
    if (i === '5' && newHPx) resizeHeightParamsAttributesTable.value = newHPx
  }
</script>
<style scoped lang="sass">
  @import "assemblyGroup"
</style>
