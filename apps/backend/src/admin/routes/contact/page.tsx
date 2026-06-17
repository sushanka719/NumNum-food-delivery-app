import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Envelope } from "@medusajs/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, Heading, Text, Badge, Button, Table, toast } from "@medusajs/ui";
import { sdk } from "../../lib/sdk";

type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, "green" | "orange" | "blue" | "grey"> = {
  new: "orange",
  read: "blue",
  replied: "green",
  archived: "grey",
};

const NEXT_STATUS: Record<string, string> = {
  new: "read",
  read: "replied",
  replied: "archived",
  archived: "archived",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Mark Read",
  read: "Mark Replied",
  replied: "Archive",
  archived: "Archived",
};

export default function ContactPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: () =>
      sdk.client.fetch<{ submissions: Submission[]; count: number }>(
        "/admin/contact"
      ),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      sdk.client.fetch(`/admin/contact/${id}`, {
        method: "POST",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const submissions = data?.submissions ?? [];
  const newCount = submissions.filter((s) => s.status === "new").length;

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
        <div>
          <Heading level="h1">Contact Submissions</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            {data?.count ?? 0} total
            {newCount > 0 && (
              <span className="ml-2 text-ui-fg-interactive font-medium">
                · {newCount} new
              </span>
            )}
          </Text>
        </div>
      </div>

      {isLoading ? (
        <div className="px-6 py-12 text-center">
          <Text size="small" className="text-ui-fg-subtle">
            Loading submissions...
          </Text>
        </div>
      ) : submissions.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Text size="small" className="text-ui-fg-subtle">
            No contact submissions yet.
          </Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Subject</Table.HeaderCell>
              <Table.HeaderCell>Message</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {submissions.map((s) => (
              <Table.Row key={s.id}>
                <Table.Cell>
                  <Text size="small" weight="plus">
                    {s.first_name} {s.last_name}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <a
                    href={`mailto:${s.email}`}
                    className="text-ui-fg-interactive hover:underline text-sm"
                  >
                    {s.email}
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{s.subject}</Text>
                </Table.Cell>
                <Table.Cell className="max-w-xs">
                  <Text
                    size="small"
                    className="text-ui-fg-subtle truncate block max-w-[280px]"
                  >
                    {s.message}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="text-ui-fg-subtle whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={STATUS_COLORS[s.status] ?? "grey"} size="2xsmall">
                    {s.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {s.status !== "archived" && (
                    <Button
                      size="small"
                      variant="secondary"
                      isLoading={updateStatus.isPending}
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({
                          id: s.id,
                          status: NEXT_STATUS[s.status],
                        })
                      }
                    >
                      {STATUS_LABELS[s.status]}
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
}

export const config = defineRouteConfig({
  label: "Contact",
  icon: Envelope,
});
