interface DropdownProps {
  current: string
  values: string[]
  open: boolean
  zIndex: number
  toggle: () => void
  setValue: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ current, values, open, zIndex, toggle, setValue }) => {
  return (
    <div className="pvtDropdown" style={{ zIndex }}>
      <div
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        className={'pvtDropdownValue pvtDropdownCurrent ' + (open ? 'pvtDropdownCurrentOpen' : '')}
        role="button"
      >
        <div className="pvtDropdownIcon">{open ? '×' : '▾'}</div>
        {current || <span>&nbsp;</span>}
      </div>

      {open && (
        <div className="pvtDropdownMenu">
          {values.map((r) => (
            <div
              key={r}
              role="button"
              onClick={(e) => {
                e.stopPropagation()
                if (current === r) {
                  toggle()
                } else {
                  setValue(r)
                }
              }}
              className={'pvtDropdownValue ' + (r === current ? 'pvtDropdownActiveValue' : '')}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
