import * as React from 'react';

import type { OnboardingFormData } from '@/lib/onboarding';

type RowData = Record<string, string | undefined>;

type Column<T extends RowData> = {
  header: string;
  accessor: keyof T;
};

interface OnboardingEmailTemplateProps {
  content: OnboardingFormData;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#f4f7fb',
    color: '#1f2937',
    fontFamily: 'Arial, sans-serif',
    padding: '24px',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    margin: '0 auto',
    maxWidth: '920px',
    overflow: 'hidden',
    border: '1px solid #dbe4f0',
  },
  header: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '24px',
  },
  eyebrow: {
    color: '#8bbbff',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    margin: 0,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '24px',
    lineHeight: 1.25,
    margin: '10px 0 0',
  },
  body: {
    padding: '24px',
  },
  section: {
    borderTop: '1px solid #e5edf7',
    paddingTop: '22px',
    marginTop: '22px',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: '18px',
    margin: '0 0 14px',
  },
  label: {
    color: '#475569',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    margin: '0 0 4px',
    textTransform: 'uppercase',
  },
  value: {
    color: '#1f2937',
    fontSize: '14px',
    lineHeight: 1.6,
    margin: '0 0 14px',
    whiteSpace: 'pre-wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  table: {
    borderCollapse: 'collapse',
    marginBottom: '16px',
    width: '100%',
  },
  th: {
    backgroundColor: '#eef4fb',
    border: '1px solid #dbe4f0',
    color: '#334155',
    fontSize: '12px',
    padding: '10px',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  td: {
    border: '1px solid #dbe4f0',
    color: '#1f2937',
    fontSize: '13px',
    lineHeight: 1.5,
    padding: '10px',
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap',
  },
  list: {
    margin: '0 0 16px 18px',
    padding: 0,
  },
  listItem: {
    fontSize: '14px',
    lineHeight: 1.6,
    marginBottom: '4px',
  },
  footer: {
    borderTop: '1px solid #e5edf7',
    color: '#64748b',
    fontSize: '12px',
    marginTop: '24px',
    paddingTop: '16px',
  },
};

function clean(value?: string) {
  return value?.trim() || 'Not provided';
}

function hasRowValues(row: RowData) {
  return Object.values(row).some((value) => Boolean(value?.trim()));
}

function ValueBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p style={styles.label}>{label}</p>
      <p style={styles.value}>{clean(value)}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function ListValue({ values }: { values?: string[] }) {
  const selectedValues = values?.filter((value) => value.trim()) ?? [];

  if (!selectedValues.length) {
    return <p style={styles.value}>Not provided</p>;
  }

  return (
    <ul style={styles.list}>
      {selectedValues.map((value) => (
        <li key={value} style={styles.listItem}>{value}</li>
      ))}
    </ul>
  );
}

function DataTable<T extends RowData>({
  rows,
  columns,
}: {
  rows?: T[];
  columns: Column<T>[];
}) {
  const populatedRows = rows?.filter(hasRowValues) ?? [];

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.accessor)} style={styles.th}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {populatedRows.length ? (
          populatedRows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.accessor)} style={styles.td}>
                  {clean(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} style={styles.td}>Not provided</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function OnboardingEmailTemplate({ content }: OnboardingEmailTemplateProps) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>New client onboarding intake</p>
          <h2 style={styles.title}>{clean(content.protocolProjectName)}</h2>
        </div>

        <div style={styles.body}>
          <div style={styles.grid}>
            <ValueBlock label="Client contact name" value={content.contactName} />
            <ValueBlock label="Client contact email" value={content.contactEmail} />
          </div>

          <Section title="1. Audit Target">
            <div style={styles.grid}>
              <ValueBlock label="Protocol / project name" value={content.protocolProjectName} />
              <ValueBlock label="Repo URL" value={content.repoUrl} />
              <ValueBlock label="Commit / tag / branch" value={content.auditReference} />
            </div>
            <ValueBlock label="Multiple repos or packages in scope" value={content.multipleReposScope} />
            <ValueBlock label="Non-standard setup needed" value={content.nonStandardSetup} />
          </Section>

          <Section title="2. Scope">
            <DataTable
              rows={content.inScopeItems}
              columns={[
                { header: 'Path', accessor: 'path' },
                { header: 'Contract / module', accessor: 'contractModule' },
                { header: 'Notes', accessor: 'notes' },
              ]}
            />
            <ValueBlock label="Explicitly out of scope" value={content.outOfScope} />
            <ValueBlock label="Review surface selections" value={content.reviewSurface?.join(', ')} />
            <ValueBlock label="Review surface notes" value={content.reviewSurfaceNotes} />
            <ValueBlock label="Third-party dependency scope" value={content.dependencyScope} />
            <ValueBlock label="Selected dependencies / notes" value={content.selectedDependenciesNotes} />
          </Section>

          <Section title="3. Protocol Intent">
            <ValueBlock label="Most important user flows" value={content.importantUserFlows} />
            <ValueBlock label="Most security-critical flows" value={content.securityCriticalFlows} />
            <ValueBlock label="What should never happen" value={content.forbiddenStates} />
            <ValueBlock label="Intentionally allowed edge cases" value={content.allowedEdgeCases} />
            <ValueBlock label="Risky-looking behavior that is intentional" value={content.intentionalRiskyBehavior} />
          </Section>

          <Section title="4. Assets And Integrations">
            <DataTable
              rows={content.controlledAssets}
              columns={[
                { header: 'Asset', accessor: 'asset' },
                { header: 'Chain', accessor: 'chain' },
                { header: 'Role in protocol', accessor: 'roleInProtocol' },
                { header: 'Expected behavior', accessor: 'expectedTokenBehavior' },
              ]}
            />
            <p style={styles.label}>Supported token behaviors</p>
            <ListValue values={content.supportedTokenBehaviors} />
            <ValueBlock label="Supported token behavior notes" value={content.supportedTokenNotes} />
            <ValueBlock label="Explicitly unsupported token behaviors" value={content.unsupportedTokenBehaviors} />
            <DataTable
              rows={content.externalDependencies}
              columns={[
                { header: 'Dependency', accessor: 'dependency' },
                { header: 'Used for', accessor: 'usedFor' },
                { header: 'Trust / availability assumption', accessor: 'trustAssumption' },
              ]}
            />
            <DataTable
              rows={content.oracleSources}
              columns={[
                { header: 'Oracle', accessor: 'oracle' },
                { header: 'Used for', accessor: 'usedFor' },
                { header: 'Expected freshness', accessor: 'expectedFreshness' },
                { header: 'Fallback behavior', accessor: 'fallbackBehavior' },
              ]}
            />
            <ValueBlock label="Keepers, relayers, bots, or off-chain services" value={content.safetyLivenessServices} />
          </Section>

          <Section title="5. Roles And Trust">
            <DataTable
              rows={content.privilegedRoles}
              columns={[
                { header: 'Role', accessor: 'role' },
                { header: 'Powers', accessor: 'powers' },
                { header: 'Current / expected holder', accessor: 'holder' },
                { header: 'Timelock / multisig?', accessor: 'timelockMultisig' },
              ]}
            />
            <DataTable
              rows={content.trustedRoles}
              columns={[
                { header: 'Role', accessor: 'role' },
                { header: 'Trusted?', accessor: 'trusted' },
                { header: 'Why', accessor: 'why' },
              ]}
            />
            <ValueBlock label="Privileged-role actions in audit surface" value={content.privilegedAuditSurface} />
            <ValueBlock label="Upgrade process" value={content.upgradeProcess} />
            <ValueBlock label="Emergency controls" value={content.emergencyControls} />
          </Section>

          <Section title="6. Known Risks">
            <DataTable
              rows={content.knownIssues}
              columns={[
                { header: 'Issue', accessor: 'issue' },
                { header: 'Affected area', accessor: 'affectedArea' },
                { header: 'Accepted / deferred?', accessor: 'disposition' },
                { header: 'Reason', accessor: 'reason' },
              ]}
            />
            <ValueBlock label="Prior audits or internal reviews" value={content.priorAudits} />
            <ValueBlock label="Areas especially worried about" value={content.worryAreas} />
            <ValueBlock label="Areas not worth auditor time" value={content.avoidAreas} />
          </Section>

          <Section title="7. Reporting Preferences">
            <ValueBlock label="Include Low / QA / Info findings" value={content.includeLowQaInfo} />
            <ValueBlock label="Low / QA / Info notes" value={content.lowQaInfoNotes} />
            <ValueBlock label="Severity edge cases" value={content.severityEdgeCases} />
            <p style={styles.label}>Preferred output format</p>
            <ListValue values={content.preferredOutputFormats} />
            <ValueBlock label="Output format notes" value={content.preferredOutputNotes} />
            <ValueBlock label="Anything else auditors should know" value={content.additionalAuditorContext} />
          </Section>

          <p style={styles.footer}>
            This onboarding intake was submitted through the ChainShield client onboarding form.
          </p>
        </div>
      </div>
    </div>
  );
}
